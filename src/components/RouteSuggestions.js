const RouteSuggestions = styled(ContentBox)`
  margin-top: 15px;
`;

const RouteOption = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(25, 161, 170, 0.05);
  }
`;

const RouteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const RouteModeBadges = styled.div`
  display: flex;
  gap: 8px;
`;

const ModeBadge = styled.span`
  background: ${props => props.isTransit ? '#19A1AA' : '#e8f5e9'};
  color: ${props => props.isTransit ? 'white' : '#2e7d32'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RouteTiming = styled.div`
  color: #666;
  font-size: 14px;
`;

const RouteMetrics = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 14px;
  color: #666;
`;

const EcoMetric = styled.div`
  color: #2e7d32;
  display: flex;
  align-items: center;
  gap: 4px;
`;