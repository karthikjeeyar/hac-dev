import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Flex, FlexItem, ModalVariant, Stack, StackItem } from '@patternfly/react-core';
import { DownloadIcon, CompressIcon, ExpandIcon } from '@patternfly/react-icons/dist/js/icons';
import { classNames } from '@patternfly/react-table';
import { RunStatus } from '@patternfly/react-topology';
import { saveAs } from 'file-saver';
import Logs from '../../shared/components/pipeline-run-logs/logs/Logs';
import { getRenderContainers } from '../../shared/components/pipeline-run-logs/logs/logs-utils';
import { EmptyBox, LoadingBox, LoadingInline } from '../../shared/components/status-box/StatusBox';
import { PodKind } from '../../shared/components/types';
import { useFullscreen } from '../../shared/hooks/fullscreen';
import { ScrollDirection, useScrollDirection } from '../../shared/hooks/scroll';
import { calculateDuration, getPodStatus } from '../../utils/pipeline-utils';
import { ComponentProps, createModalLauncher } from '../modal/createModalLauncher';
import { useModalLauncher } from '../modal/ModalProvider';
import { ContainerDropdown } from './ContainerDropdown';
import './PodLogsViewer.scss';

type PodLogViewerProps = ComponentProps & {
  pod: PodKind;
  downloadAllLabel?: string;
  onDownloadAll?: () => Promise<Error>;
};

export const PodLogViewer: React.FC<PodLogViewerProps> = ({
  pod,
  downloadAllLabel,
  onDownloadAll,
}) => {
  const { t } = useTranslation();
  const scrollPane = React.useRef<HTMLDivElement>();
  const completedRef = React.useRef<boolean[]>([]);
  const [, setRenderToCount] = React.useState(0);
  const [selectedContainer, setSelectedContainer] = React.useState(pod.spec.containers[0]);
  const [isFullscreen, fullscreenRef, fullscreenToggle] = useFullscreen<HTMLDivElement>();
  const [scrollDirection, handleScrollCallback] = useScrollDirection();
  const [autoScroll, setAutoScroll] = React.useState(true);
  const { containers } = getRenderContainers(pod);
  const [downloadAllStatus, setDownloadAllStatus] = React.useState(false);
  const dataRef = React.useRef(null);
  dataRef.current = containers;

  const handleComplete = React.useCallback((containerName) => {
    const index = dataRef.current.findIndex(({ name }) => name === containerName);
    completedRef.current[index] = true;
    const newRenderTo = dataRef.current.findIndex((c, i) => completedRef.current[i] !== true);
    if (newRenderTo === -1) {
      setRenderToCount(dataRef.current.length);
    } else {
      setRenderToCount(newRenderTo);
    }
  }, []);

  React.useEffect(() => {
    if (!scrollDirection) return;
    if (scrollDirection === ScrollDirection.scrollingUp && autoScroll === true) {
      setAutoScroll(false);
    }
    if (scrollDirection === ScrollDirection.scrolledToBottom && autoScroll === false) {
      setAutoScroll(true);
    }
  }, [autoScroll, scrollDirection]);

  const startDownloadAll = () => {
    setDownloadAllStatus(true);
    onDownloadAll()
      .then(() => {
        setDownloadAllStatus(false);
      })
      .catch((err: Error) => {
        setDownloadAllStatus(false);
        // eslint-disable-next-line no-console
        console.warn(err.message || t('Error downloading logs.'));
      });
  };

  const downloadLogs = () => {
    if (!scrollPane.current) return;
    const logString = scrollPane.current.innerText;
    const blob = new Blob([logString], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, `${pod.metadata.name}.log`);
  };

  const divider = <FlexItem className="multi-stream-logs__divider">|</FlexItem>;
  if (!pod) {
    return <EmptyBox label="pipeline runs" />;
  }

  return (
    <Stack>
      <StackItem>
        <span style={{ marginRight: 'var(--pf-global--spacer--lg)' }}>
          {' '}
          <b>Pod status:</b> {getPodStatus(pod)}
        </span>

        {pod?.status.containerStatuses.length > 0 && (
          <span style={{ marginRight: 'var(--pf-global--spacer--lg)' }}>
            {' '}
            <b>Number of restarts:</b> {pod?.status.containerStatuses[0].restartCount}
          </span>
        )}
        <span>
          {' '}
          <b> Age:</b>{' '}
          {pod?.status?.startTime
            ? calculateDuration(pod.status?.startTime, pod.status?.completionTime)
            : '-'}
        </span>
      </StackItem>
      <StackItem isFilled>
        <div ref={fullscreenRef} className="multi-stream-logs">
          <Flex
            className={(classNames as any)({
              'multi-stream-logs--fullscreen': isFullscreen,
            })}
          >
            <FlexItem>
              <ContainerDropdown
                initContainers={pod.spec.initContainers}
                containers={containers}
                selectedContainer={selectedContainer}
                onChange={setSelectedContainer}
              />
            </FlexItem>
            <FlexItem className="multi-stream-logs__button" align={{ default: 'alignRight' }}>
              <Button variant="link" onClick={downloadLogs} isInline>
                <DownloadIcon className="multi-stream-logs__icon" />
                {t('Download')}
              </Button>
            </FlexItem>
            {divider}
            {onDownloadAll && (
              <>
                <FlexItem className="multi-stream-logs__button">
                  <Button
                    variant="link"
                    onClick={startDownloadAll}
                    isDisabled={downloadAllStatus}
                    isInline
                  >
                    <DownloadIcon className="multi-stream-logs__icon" />
                    {downloadAllLabel || t('Download all')}
                    {downloadAllStatus && <LoadingInline />}
                  </Button>
                </FlexItem>
                {divider}
              </>
            )}
            {fullscreenToggle && (
              <FlexItem className="multi-stream-logs__button">
                <Button variant="link" onClick={fullscreenToggle} isInline>
                  {isFullscreen ? (
                    <>
                      <CompressIcon className="multi-stream-logs__icon" />
                      {t('Collapse')}
                    </>
                  ) : (
                    <>
                      <ExpandIcon className="multi-stream-logs__icon" />
                      {t('Expand')}
                    </>
                  )}
                </Button>
              </FlexItem>
            )}
          </Flex>
          <div
            className="multi-stream-logs__container"
            onScroll={handleScrollCallback}
            data-testid="logs-task-container"
          >
            <div className="multi-stream-logs__container__logs" ref={scrollPane}>
              {pod?.spec?.containers ? (
                <Logs
                  resource={pod}
                  container={selectedContainer}
                  resourceStatus={RunStatus.Running}
                  render={true}
                  onComplete={handleComplete}
                  autoScroll={true}
                />
              ) : (
                <LoadingBox />
              )}
            </div>
          </div>
        </div>
      </StackItem>
    </Stack>
  );
};

export const podLogViewerLauncher = createModalLauncher(PodLogViewer, {
  className: 'build-log-viewer',
  'data-testid': 'view-build-logs-modal',
  variant: ModalVariant.large,
  title: 'View pod logs',
});

export const usePodLogViewerModal = (pod: PodKind) => {
  const showModal = useModalLauncher();
  return React.useCallback(() => showModal(podLogViewerLauncher({ pod })), [pod, showModal]);
};
