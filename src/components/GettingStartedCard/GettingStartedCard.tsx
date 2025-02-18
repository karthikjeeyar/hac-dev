import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardTitle,
  PageSection,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import CloseIcon from '@patternfly/react-icons/dist/js/icons/close-icon';
import classnames from 'classnames';
import { useLocalStorage } from '../../hooks';
import './GettingStartedCard.scss';

type GettingStartedCardProps = {
  imgClassName?: string;
  localStorageKey: string;
  title: string;
  imgSrc?: string;
  imgAlt?: string;
};

const LOCAL_STORAGE_KEY = 'getting-started-card';

export const GettingStartedCard: React.FC<GettingStartedCardProps> = ({
  imgClassName,
  localStorageKey,
  title,
  imgSrc,
  imgAlt,
  children,
}) => {
  const [storageKeys, setStorageKeys] =
    useLocalStorage<{ [key: string]: boolean }>(LOCAL_STORAGE_KEY);

  const keys = storageKeys && typeof storageKeys === 'object' ? storageKeys : {};
  const isDismissed = keys[localStorageKey];

  return (
    !isDismissed && (
      <PageSection>
        <Card>
          <Split>
            {imgSrc && (
              <SplitItem
                className={classnames('pf-u-min-width getting-started-card__img', imgClassName)}
              >
                <img src={imgSrc} alt={imgAlt} />
              </SplitItem>
            )}
            <SplitItem isFilled>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardActions>
                  <Button
                    variant="plain"
                    aria-label="Hide card"
                    onClick={() => setStorageKeys({ ...keys, [localStorageKey]: true })}
                  >
                    <CloseIcon />
                  </Button>
                </CardActions>
              </CardHeader>
              <CardBody>{children}</CardBody>
            </SplitItem>
          </Split>
        </Card>
      </PageSection>
    )
  );
};
