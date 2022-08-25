import * as React from 'react';
import { css } from '@patternfly/react-styles';
<<<<<<< HEAD
import { observer, Node, NodeModel, TaskNode } from '@patternfly/react-topology';
=======
import styles from '@patternfly/react-styles/css/components/Topology/topology-components';
import {
  observer,
  Node,
  NodeModel,
  createSvgIdUrl,
  useHover,
  TaskNode,
} from '@patternfly/react-topology';
import {
  NODE_SHADOW_FILTER_ID,
  NODE_SHADOW_FILTER_ID_HOVER,
} from '@patternfly/react-topology/dist/esm/components/nodes/NodeShadows';
import { ICON_DECORATOR_RADIUS } from '../const';
>>>>>>> b6b3685 (Add HAC build service application workflow visualiation)
import { WorkflowNodeModelData } from '../types';
import { getWorkflowNodeIcon } from '../utils/node-icon-utils';

import './WorkflowNode.scss';

type WorkflowNodeProps = {
  element: Node<NodeModel, WorkflowNodeModelData>;
};

const WorkflowNode: React.FC<WorkflowNodeProps> = ({ element }) => {
<<<<<<< HEAD
  const { isDisabled, workflowType } = element.getData();

  return (
    <TaskNode
      truncateLength={element.getData().label?.length}
      element={element}
      className={css({ 'hacbs-workload-node__disabled': isDisabled })}
      taskIcon={getWorkflowNodeIcon(workflowType)}
      taskIconTooltip={workflowType}
      paddingY={6}
    />
=======
  const { id, isDisabled, workflowType, label } = element.getData();

  const [hover, hoverRef] = useHover();

  return (
    <g ref={hoverRef}>
      <TaskNode
        key={`${id}${label?.toLowerCase().split(' ').join('-')}`} // Todo: temporary fix, we can remove this once https://github.com/patternfly/patternfly-react/issues/7719 is addressed
        element={element}
        className={css({ 'hacbs-workload-node__disabled': isDisabled })}
      />
      <g transform={`translate( ${ICON_DECORATOR_RADIUS}, ${ICON_DECORATOR_RADIUS})`}>
        <circle
          key={hover ? 'circle-hover' : 'circle'}
          className={css(styles.topologyNodeDecoratorBg)}
          r={ICON_DECORATOR_RADIUS}
          filter={
            hover
              ? createSvgIdUrl(NODE_SHADOW_FILTER_ID_HOVER)
              : createSvgIdUrl(NODE_SHADOW_FILTER_ID)
          }
        />
        <g
          className={css(styles.topologyNodeDecoratorIcon)}
          style={{ fontSize: `${ICON_DECORATOR_RADIUS}px` }}
          transform={`translate(-${ICON_DECORATOR_RADIUS / 2}, -${ICON_DECORATOR_RADIUS / 2})`}
        >
          {getWorkflowNodeIcon(workflowType)}
        </g>
      </g>
    </g>
>>>>>>> b6b3685 (Add HAC build service application workflow visualiation)
  );
};

export default observer(WorkflowNode);
