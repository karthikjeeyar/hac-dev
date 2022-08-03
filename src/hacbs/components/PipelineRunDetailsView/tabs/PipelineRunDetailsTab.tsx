import * as React from 'react';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Title,
} from '@patternfly/react-core';
import {
  ModelKind,
  withPanZoom,
  GraphComponent,
  DefaultTaskGroup,
  DEFAULT_EDGE_TYPE,
  DEFAULT_FINALLY_NODE_TYPE,
  DEFAULT_SPACER_NODE_TYPE,
  DEFAULT_TASK_NODE_TYPE,
  SpacerNode,
  TaskEdge,
  ComponentFactory,
} from '@patternfly/react-topology';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { calculateDuration } from '../../../utils/pipeline-utils';
import { PipelineLayout } from '../../ApplicationDetails/tabs/overview/visualization/const';
import { layoutFactory } from '../../ApplicationDetails/tabs/overview/visualization/factories';
import { getPipelineRunDataModel } from '../../topology/topology-utils';
import VisualizationFactory from '../../topology/VisualizationSurface';
import PipelineRunNode from '../visualization/PipelineRunNode';

type PipelineRunDetailsTabProps = {
  pipelineRun: any;
  PipelineLayout: any;
};
const componentFactory: ComponentFactory = (kind: ModelKind, type: string) => {
  if (kind === ModelKind.graph) {
    return withPanZoom()(GraphComponent);
  }
  switch (type) {
    case DEFAULT_TASK_NODE_TYPE:
      return PipelineRunNode;
    // return FinallyNode; // withContextMenu(() => defaultMenu)(withSelection()(FinallyNode));
    // return withContextMenu(() => defaultMenu)(withSelection()(DemoTaskNode));
    case DEFAULT_FINALLY_NODE_TYPE:
    case 'finally-group':
      return DefaultTaskGroup;
    case DEFAULT_SPACER_NODE_TYPE:
      return SpacerNode;
    case 'finally-spacer-edge':
    case DEFAULT_EDGE_TYPE:
      return TaskEdge;
    default:
      return undefined;
  }
};

const PipelineRunDetailsTab: React.FC<PipelineRunDetailsTabProps> = ({ pipelineRun }) => {
  const dag = getPipelineRunDataModel(pipelineRun);
  const model = {
    graph: {
      id: 'g1',
      type: 'graph',
      x: 0,
      y: 0,
      width: 1200,
      height: 450,
      scale: 0.9,
      layout: PipelineLayout.DAGRE_VIEWER,
    },
    nodes: dag.nodes,
    edges: dag.edges,
  };
  const duration = calculateDuration(
    typeof pipelineRun.status?.startTime === 'string' ? pipelineRun.status?.startTime : '',
    typeof pipelineRun.status?.completionTime === 'string'
      ? pipelineRun.status?.completionTime
      : '',
  );
  return (
    <>
      <Title headingLevel="h4" className="pf-c-title pf-u-mt-lg pf-u-mb-lg">
        Pipelinerun details
      </Title>
      <div className="hacbs-workflow-graph" data-test="workflow-graph">
        <VisualizationFactory
          componentFactory={componentFactory}
          layoutFactory={layoutFactory}
          model={model}
        />
      </div>
      <DescriptionList
        columnModifier={{
          default: '2Col',
        }}
      >
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>{pipelineRun.metadata.name}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Status</DescriptionListTerm>
          <DescriptionListDescription>
            {pipelineRun.status?.conditions[0].status === 'False' ? 'Failed' : 'Succeeded'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Namespace</DescriptionListTerm>
          <DescriptionListDescription>{pipelineRun.metadata.namespace}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Message</DescriptionListTerm>
          <DescriptionListDescription>
            {pipelineRun.status?.conditions[0].message}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Labels</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Log snippet</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Created at</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Pipeline</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Owner</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Triggered by</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Duration</DescriptionListTerm>
          <DescriptionListDescription>{duration}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Application</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup />
        <DescriptionListGroup>
          <DescriptionListTerm>Component</DescriptionListTerm>
          <DescriptionListDescription>
            {pipelineRun.metadata.labels[PipelineRunLabel.COMPONENT]}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup />
        <DescriptionListGroup>
          <DescriptionListTerm>Source</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup />
        <DescriptionListGroup>
          <DescriptionListTerm>Workspace</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup />
        <DescriptionListGroup>
          <DescriptionListTerm>Compliance</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup />
        <DescriptionListGroup>
          <DescriptionListTerm>Environment</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </>
  );
};

export default PipelineRunDetailsTab;
