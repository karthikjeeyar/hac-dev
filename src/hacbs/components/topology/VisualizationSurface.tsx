import * as React from 'react';
import {
  GRAPH_LAYOUT_END_EVENT,
  Model,
  Node,
  Visualization,
  VisualizationSurface,
  VisualizationProvider,
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  TopologyControlBar,
  TopologyView,
  Controller,
  LayoutFactory,
  ComponentFactory,
  Dimensions,
  ScaleDetailsLevel,
} from '@patternfly/react-topology';
import { DROP_SHADOW_SPACING, DEFAULT_NODE_HEIGHT, TOOLBAR_HEIGHT } from './const';

type VisualizationFactoryProps = {
  model: Model;
  layoutFactory: LayoutFactory;
  componentFactory: ComponentFactory;
};

type Size = {
  height: number;
  width: number;
};

const VisualizationFactory: React.FC<VisualizationFactoryProps> = ({
  model,
  layoutFactory,
  componentFactory,
}) => {
  const [controller, setController] = React.useState<Controller>(null);
  const [maxSize, setMaxSize] = React.useState<Size>(null);

  const onLayoutUpdate = React.useCallback(
    (nodes: Node[], smallNode: boolean) => {
      const nodeBounds = nodes.map((node) => node.getBounds());
      if (smallNode) {
        nodes.map((node) => node.setDimensions(new Dimensions(30, 30)));
      }
      const maxWidth = Math.floor(
        nodeBounds.map((bounds) => bounds.width).reduce((w1, w2) => Math.max(w1, w2), 0),
      );
      const maxX = Math.floor(
        nodeBounds.map((bounds) => bounds.x).reduce((x1, x2) => Math.max(x1, x2), 0),
      );

      const maxY = Math.floor(
        nodeBounds.map((bounds) => bounds.y).reduce((y1, y2) => Math.max(y1, y2), 0),
      );

      const verticalMargin = 20;
      const horizontalMargin = 20;

      setMaxSize({
        height:
          maxY + DEFAULT_NODE_HEIGHT + DROP_SHADOW_SPACING + TOOLBAR_HEIGHT + verticalMargin * 2,
        width: maxX + maxWidth + DROP_SHADOW_SPACING + horizontalMargin * 2,
      });
    },
    [setMaxSize],
  );

  React.useEffect(() => {
    if (controller === null) {
      const visualization = new Visualization();
      visualization.registerLayoutFactory(layoutFactory);
      visualization.registerComponentFactory(componentFactory);
      visualization.fromModel(model);
      visualization.addEventListener(GRAPH_LAYOUT_END_EVENT, () => {
        onLayoutUpdate(
          visualization.getGraph().getNodes(),
          visualization.getGraph().getDetailsLevel() !== ScaleDetailsLevel.high,
        );
      });

      visualization.setRenderConstraint(true, { paddingPercentage: 70 });

      setController(visualization);
    } else {
      controller.fromModel(model);
      controller.getGraph().layout();
    }
  }, [controller, model, onLayoutUpdate, layoutFactory, componentFactory]);

  if (!controller) return null;

  return (
    <TopologyView
      controlBar={
        <TopologyControlBar
          controlButtons={createTopologyControlButtons({
            ...defaultControlButtonsOptions,
            zoomInCallback: action(() => {
              controller.getGraph().scaleBy(4 / 3);
            }),
            zoomOutCallback: action(() => {
              controller.getGraph().scaleBy(0.75);
            }),
            fitToScreenCallback: action(() => {
              controller.getGraph().fit(70);
            }),
            resetViewCallback: action(() => {
              controller.getGraph().reset();
              controller.getGraph().layout();
            }),
            legend: false,
          })}
        />
      }
    >
      <div
        style={{ height: maxSize?.height, width: maxSize?.width }}
        key={controller.getGraph().getDetailsLevel()}
      >
        <VisualizationProvider controller={controller}>
          <VisualizationSurface />
        </VisualizationProvider>
      </div>
    </TopologyView>
  );
};

export default VisualizationFactory;
