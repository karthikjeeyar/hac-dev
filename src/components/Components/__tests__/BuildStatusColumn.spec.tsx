import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, render, screen, waitFor } from '@testing-library/react';
import { componentCRMocks } from '../__data__/mock-data';
import { mockPipelineRuns } from '../__data__/mock-pipeline-run';
import BuildStatusColumn from '../BuildStatusColumn';

configure({ testIdAttribute: 'data-testId' });

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../utils/component-utils', () => {
  const actual = jest.requireActual('../../../utils/component-utils');
  return {
    ...actual,
    useURLForComponentPRs: jest.fn(),
  };
});

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

describe('BuildStatusColumn', () => {
  it('should render View Build logs action item', async () => {
    useK8sWatchResourceMock.mockReturnValue([mockPipelineRuns, true]);
    render(
      <BrowserRouter>
        <BuildStatusColumn component={componentCRMocks[0]} />
      </BrowserRouter>,
    );
    await waitFor(() => screen.getByText('Build Succeeded'));
    await waitFor(() => screen.getByText('View build logs'));
  });
  it('should render failures', async () => {
    useK8sWatchResourceMock.mockReturnValue([[mockPipelineRuns[2]], true]);
    render(
      <BrowserRouter>
        <BuildStatusColumn component={componentCRMocks[1]} />
      </BrowserRouter>,
    );
    await waitFor(() => screen.getByText('Build Failed'));
    await waitFor(() => screen.getByText('View build logs'));
  });

  it('should not render merge status if the pipelineruns is still loading', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], false]);
    render(
      <BrowserRouter>
        <BuildStatusColumn component={componentCRMocks[1]} />
      </BrowserRouter>,
    );
    expect(screen.queryByText('Merge build PR')).not.toBeInTheDocument();
  });

  it('should not render View Build logs action item for components without build pipelinerun', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], true]);
    render(
      <BrowserRouter>
        <BuildStatusColumn component={componentCRMocks[0]} />
      </BrowserRouter>,
    );
    expect(screen.queryByText('View build logs')).not.toBeInTheDocument();
  });

  it('should render View Build logs action item for components without PAC annotation', async () => {
    useK8sWatchResourceMock.mockReturnValue([[mockPipelineRuns], true]);
    render(
      <BrowserRouter>
        <BuildStatusColumn component={componentCRMocks[0]} />
      </BrowserRouter>,
    );
    await waitFor(() => screen.getByText('View build logs'));
  });
});
