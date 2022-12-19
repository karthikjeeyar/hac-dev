import * as React from 'react';
import { PipelineRunLabel } from '../../../../../../consts/pipelinerun';
import { useIntegrationTestScenarios } from '../../../../../../hooks/useIntegrationTestScenarios';
import { useTestPipelines } from '../../../../../../hooks/useTestPipelines';
import { pipelineRunStatus } from '../../../../../../shared';
import { PipelineRunKind } from '../../../../../../shared/components/pipeline-run-logs/types';
import { IntegrationTestScenarioKind } from '../../../../../../types/coreBuildService';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import { emptyPipelineNode, resourceToPipelineNode } from '../utils/node-utils';
import { updateParallelNodeWidths } from '../utils/visualization-utils';

const matchPipelineRunToTest = (
  pipeline: PipelineRunKind,
  test: IntegrationTestScenarioKind,
): boolean => {
  const pipelineRunComponent = pipeline.metadata.labels[PipelineRunLabel.COMPONENT];
  if (!pipelineRunComponent || !test.spec.contexts?.length) {
    return false;
  }
  return !!test.spec.contexts.find((c) => c.name === pipelineRunComponent);
};

export const useAppIntegrationTestNodes = (
  namespace: string,
  applicationName: string,
  previousTasks: string[],
  expanded: boolean,
): [
  nodes: WorkflowNodeModel<WorkflowNodeModelData>[],
  tasks: string[],
  resources: IntegrationTestScenarioKind[],
  loaded: boolean,
  errors: unknown[],
] => {
  const [integrationTests, testsLoaded, testsError] = useIntegrationTestScenarios(
    namespace,
    applicationName,
  );
  const [testPipelines, testPipelinesLoaded, testPipelinesError] = useTestPipelines(
    namespace,
    applicationName,
  );
  const allLoaded = testsLoaded && testPipelinesLoaded;
  const allErrors = [testsError, testPipelinesError].filter((e) => !!e);

  const componentIntegrationTests = React.useMemo(() => {
    if (!allLoaded || allErrors.length > 0) {
      return [];
    }
    return integrationTests?.filter((test) => {
      const contexts = test?.spec?.contexts;
      return contexts?.some((c) => c.name === 'component') ?? false;
    });
  }, [allLoaded, integrationTests, allErrors]);

  const componentTestNodes = React.useMemo(() => {
    if (!allLoaded) {
      return [];
    }
    const nodes = componentIntegrationTests?.length
      ? componentIntegrationTests.map((test) => {
          const testPipeline = testPipelines?.find((pipeline) =>
            matchPipelineRunToTest(pipeline, test),
          );
          return resourceToPipelineNode(
            test,
            WorkflowNodeType.COMPONENT_TEST,
            previousTasks,
            testPipeline ? pipelineRunStatus(testPipeline) : 'Pending',
          );
        })
      : [
          emptyPipelineNode(
            'no-component-tests',
            'No component tests set',
            WorkflowNodeType.COMPONENT_TEST,
            previousTasks,
          ),
        ];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [allLoaded, componentIntegrationTests, previousTasks, testPipelines]);

  const componentIntegrationTestTasks = React.useMemo(
    () => (expanded ? componentTestNodes.map((c) => c.id) : []),
    [componentTestNodes, expanded],
  );

  return [
    componentTestNodes,
    componentIntegrationTestTasks,
    componentIntegrationTests,
    allLoaded,
    allErrors,
  ];
};
