import * as React from 'react';
import { PopoverProps } from '@patternfly/react-core';
import {
  DEFAULT_WHEN_OFFSET,
  Node,
  RunStatus,
  ScaleDetailsLevel,
  TaskNode,
  WhenDecorator,
  WithContextMenuProps,
  WithSelectionProps,
} from '@patternfly/react-topology';
import useDetailsLevel from '@patternfly/react-topology/dist/esm/hooks/useDetailsLevel';
import { observer } from 'mobx-react';

type PipelineRunNodeProps = {
  element: Node;
} & WithContextMenuProps &
  WithSelectionProps;

const PipelineRunNode: React.FunctionComponent<PipelineRunNodeProps> = ({
  element,
  onContextMenu,
  contextMenuOpen,
  ...rest
}) => {
  const data = element.getData();
  const detailsLevel = useDetailsLevel();
  const passedData = React.useMemo(() => {
    const newData = { ...data };
    Object.keys(newData).forEach((key) => {
      if (newData[key] === undefined) {
        delete newData[key];
      }
    });
    return newData;
  }, [data]);

  const hasTaskIcon = !!(data.taskIconClass || data.taskIcon);
  const whenDecorator = data.whenStatus ? (
    <WhenDecorator
      element={element}
      status={data.whenStatus}
      leftOffset={
        hasTaskIcon
          ? DEFAULT_WHEN_OFFSET + (element.getBounds().height - 4) * 0.75
          : DEFAULT_WHEN_OFFSET
      }
    />
  ) : null;
  const badgePopoverParams: PopoverProps = {
    headerContent: <div>Popover header</div>,
    bodyContent: (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id feugiat augue, nec
        fringilla turpis.
      </div>
    ),
    footerContent: 'Popover footer',
  };
  return (
    <>
      {detailsLevel !== ScaleDetailsLevel.high ? (
        <circle r={15} fill="white" />
      ) : (
        <TaskNode
          element={element}
          onContextMenu={data.showContextMenu ? onContextMenu : undefined}
          contextMenuOpen={contextMenuOpen}
          {...passedData}
          {...rest}
          status={RunStatus.Succeeded}
          badgePopoverParams={badgePopoverParams}
        >
          {whenDecorator}
        </TaskNode>
      )}
    </>
  );
};

export default observer(PipelineRunNode);
