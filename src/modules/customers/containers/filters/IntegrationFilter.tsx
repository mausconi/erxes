import gql from 'graphql-tag';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import { IntegrationFilter } from '../../components';
import { queries as customerQueries } from '../../graphql';
import { CountQueryResponse } from '../../types';

type Props = {
  customersCountQuery?: CountQueryResponse;
};

class IntegrationFilterContainer extends React.Component<Props> {
  render() {
    const { customersCountQuery } = this.props;

    let counts = {};
    let loading = false;

    if (customersCountQuery) {
      counts = customersCountQuery.customerCounts || { byIntegrationType: {} };
      loading = customersCountQuery.loading || false;
    }

    const updatedProps = {
      ...this.props,
      loading,
      counts
    };

    return <IntegrationFilter {...updatedProps} />;
  }
}

export default withProps<{ loadingMainQuery: boolean }>(
  compose(
    graphql<
      { loadingMainQuery: boolean },
      CountQueryResponse,
      { only: string }
    >(gql(customerQueries.customerCounts), {
      name: 'customersCountQuery',
      skip: ({ loadingMainQuery }) => loadingMainQuery,
      options: {
        variables: { only: 'byIntegrationType' }
      }
    })
  )(IntegrationFilterContainer)
);
