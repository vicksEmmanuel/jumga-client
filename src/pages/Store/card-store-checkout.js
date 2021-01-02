import React  from 'react';
import { Col, Card, CardBody} from "reactstrap";

const CardMaintenance = (props) => {

    return (
          <React.Fragment>
                <Col md="6">
                    <Card className="mt-4 maintenance-box" style={{borderRadius: 5, backgroundColor: '#162E58'}}>
                        <CardBody>
                            {props.children}
                        </CardBody>
                    </Card>
                </Col>
            </React.Fragment>
          );
    }
        
export default CardMaintenance;