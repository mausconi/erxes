import { EmptyState, Icon } from 'modules/common/components';
import { colors, dimensions } from 'modules/common/styles';
import { IDateColumn } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import { AddNew, Amount as DealAmount } from 'modules/deals/styles/stage';
import * as React from 'react';
import styled from 'styled-components';
import { IDeal, IDealTotalAmount } from '../../types';
import { Deal } from '../portable';

type Props = {
  deals: IDeal[];
  date: IDateColumn;
  dealTotalAmounts: IDealTotalAmount;
  onUpdate: (deal: IDeal) => void;
  onRemove: () => void;
  onLoadMore: (skip: number) => void;
};

const Container = styled.div`
  position: relative;
  max-height: 100%;
  overflow: auto;
`;

const ContentBody = styled.div`
  position: relative;
  z-index: 1;
  max-height: 100%;
  padding: 10px 8px;
  padding-bottom: ${dimensions.coreSpacing}px;
  border-radius: 0 0 4px 4px;
  overflow-y: auto;
  background: #dfe3e6;
`;

const Footer = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 37px;
  left: 0;
  right: 0;
  text-align: center;
  border-top: 1px solid ${colors.borderPrimary};
  background: ${colors.bgLight};
`;

const Amount = styled(DealAmount)`
  background: #dee3e6;
  margin: 0;
  max-width: 100%;
  display: block;
  padding: 5px 15px 0;
`;

class DealColumn extends React.Component<Props, {}> {
  onLoadMore = () => {
    const { deals, onLoadMore } = this.props;
    onLoadMore(deals.length);
  };

  renderContent() {
    const { deals, onUpdate, onRemove } = this.props;

    if (deals.length === 0) {
      return <EmptyState icon="piggy-bank" text="No deal" />;
    }

    const contents = deals.map((deal: IDeal, index: number) => (
      <Deal key={index} deal={deal} onRemove={onRemove} onUpdate={onUpdate} />
    ));

    return <ContentBody>{contents}</ContentBody>;
  }

  renderTotalAmount() {
    const { dealTotalAmounts } = this.props;
    const totals = dealTotalAmounts.dealAmounts || [];

    const content = totals.map(deal => (
      <li key={deal._id}>
        {deal.amount.toLocaleString()} <span>{deal.currency}</span>
      </li>
    ));

    return <Amount>{content}</Amount>;
  }

  renderFooter() {
    const { deals, dealTotalAmounts } = this.props;
    const count = dealTotalAmounts.dealCount;

    if (deals.length === count || deals.length > count) {
      return null;
    }

    return (
      <Footer>
        <AddNew onClick={this.onLoadMore}>
          <Icon icon="add" /> {__('Load more')}
        </AddNew>
      </Footer>
    );
  }

  render() {
    return (
      <Container>
        {this.renderTotalAmount()}
        {this.renderContent()}
        {this.renderFooter()}
      </Container>
    );
  }
}

export default DealColumn;
