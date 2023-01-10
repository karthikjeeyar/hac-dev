import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { DataState, testPipelineRuns } from '../../../../../__data__/pipelinerun-data';
import { PipelineRunLabel } from '../../../../../consts/pipelinerun';
import RelatedPipelineRuns from '../../../RelatedPipelineRuns';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

const buildPipelineRun = {
  ...testPipelineRuns[DataState.RUNNING],
  metadata: {
    ...testPipelineRuns[DataState.RUNNING].metadata,
    uid: 1,
    name: 'build-pipeline-run',
  },
};

const testPipelineRun = {
  ...testPipelineRuns[DataState.RUNNING],
  metadata: {
    ...testPipelineRuns[DataState.RUNNING].metadata,
    name: 'test-pipeline-run',
    uid: 2,
    labels: {
      ...testPipelineRuns[DataState.RUNNING].metadata.labels,
      [PipelineRunLabel.TEST_SERVICE_COMMIT]:
        testPipelineRuns[DataState.RUNNING].metadata.labels[PipelineRunLabel.COMMIT_LABEL],
    },
  },
};

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('RelatedPipelineRuns', () => {
  it('should render loading pipelineruns', () => {
    watchResourceMock.mockReturnValue([[], false]);
    render(<RelatedPipelineRuns pipelineRun={buildPipelineRun} />);

    screen.getByText('Loading related pipelines');
  });

  it('should render 0 pipelines if there is not any related pipelineruns', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<RelatedPipelineRuns pipelineRun={buildPipelineRun} />);

    screen.getByText('0 pipelines');
  });

  it('should render popover with no related pipelines is not any related pipelineruns', async () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<RelatedPipelineRuns pipelineRun={buildPipelineRun} />);
    screen.getByText('0 pipelines');

    fireEvent.click(screen.getByText('0 pipelines'));
    await waitFor(() => screen.getByTestId('related-pipelines-popover'));

    screen.getByText('No related pipelines');
  });

  it('should render popover with related pipelineruns links', async () => {
    watchResourceMock.mockReturnValue([[buildPipelineRun, testPipelineRun], true]);
    render(<RelatedPipelineRuns pipelineRun={buildPipelineRun} />);

    fireEvent.click(screen.getByText('1 pipeline'));
    await waitFor(() => screen.getByTestId('related-pipelines-popover'));

    screen.getByText('test-pipeline-run');
  });

  it('should not render the source pipelinerun inside the related pipelineruns popover', async () => {
    watchResourceMock.mockReturnValue([[buildPipelineRun, testPipelineRun], true]);
    render(<RelatedPipelineRuns pipelineRun={testPipelineRun} />);

    fireEvent.click(screen.getByText('1 pipeline'));
    await waitFor(() => screen.getByTestId('related-pipelines-popover'));

    screen.getByText('build-pipeline-run');
  });
});
