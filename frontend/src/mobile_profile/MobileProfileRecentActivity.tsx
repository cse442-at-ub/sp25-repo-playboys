// components/MobileRecentActivity.tsx
import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Activity } from './MobileProfileTypes';

interface Props {
  activities: Activity[];
}

const MobileRecentActivity: React.FC<Props> = ({ activities }) => {
  return (
    <>
      <h3 className="mt-4 mb-3">Recent Activity</h3>
      <Row className="bg-light py-2 mb-3 d-flex justify-content-center">
        {activities.map((activity, index) => (
          <Col key={index} xs={4} className="text-center">
            <div className="bg-white p-2 rounded shadow-sm">
              <p className="fw-bold">{activity.type}</p>
              <p>{activity.content}</p>
              <small className="text-muted">{activity.time}</small>
            </div>
          </Col>
        ))}
      </Row>
      <Button variant="secondary" className="w-100">Show all activity</Button>
    </>
  );
};

export default MobileRecentActivity;
