import React from 'react';
import { layoutFactory, VisualizationFactory } from '../topology/factories';
import { pipelineRuncomponentFactory } from './factories';
import { getPipelineRunDataModel } from './visualization/utils/pipelinerun-graph-utils';

import './PipelineRunVisualization.scss';

const PipelineRunVisualization = ({ pipelineRun }) => {
  const model = React.useMemo(() => {
    return getPipelineRunDataModel(pipelineRun);
  }, [pipelineRun]);

  return (
    <div className="hacbs-pipelinerun-graph" data-test="workflow-graph">
      <VisualizationFactory
        componentFactory={pipelineRuncomponentFactory}
        layoutFactory={layoutFactory}
        model={model}
      />
    </div>
  );
};
export default PipelineRunVisualization;
