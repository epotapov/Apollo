import * as React from 'react';
import Layouts from '../components/Layouts';
import {
  Row,
  Col,
  Card,
  List,
  Badge,
  Icon,
  Button,
  Tabs,
  Form,
  Input,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import user from '../static/images/user-profile.jpeg';

const data = [
  'Branding',
  'UI/UX',
  'Web - Design',
  'Packaging',
  'Print & Editorial',
];
const {TabPane} = Tabs;
function callback (key) {
  console.log (key);
}

class Profile extends React.Component {
  render () {
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 3},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 115},
      },
    };
    return (
      <Layouts title="profile">
        <Row>
          <Col xs={24}>

            <Card bordered={false} className="profile-details">
              <Row>
                <Col sm={10} md={8} xl={4} style={{padding: '20px'}}>
                  <div className="user-image m-b-20">
                    <img src={user} />
                  </div>
                  <div className="personal-info">
                    <h2>Jeremy Rose</h2>
                    <h4 className="user-designation m-b-10">
                      Product Designer
                    </h4>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      {' '}
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                      {' '}
                    </p>
                  </div>
                  <div className="contact-info">
                    <h2 className="after-underline">Contact Information</h2>
                    <Form className="m-t-15 m-b-20">
                      <Form.Item label="Phone No" className="contact-form">
                        <Input placeholder={9876543210} />
                      </Form.Item>
                      <Form.Item label="Email" className="contact-form">
                        <Input placeholder="Enter Your Email Address ...." />
                      </Form.Item>
                      <Form.Item label="Address" className="contact-form">
                        <TextArea placeholder="Enter Your  Address ...." />
                      </Form.Item>
                      <Form.Item label="Site" className="contact-form">
                        <Input placeholder="Enter your site url..." />
                      </Form.Item>
                    </Form>
                  </div>
                </Col>
                <Col sm={14} md={16} xl={20} style={{padding: '10px 20px'}}>
                  <div className="user-details">
                    <span className="floating-icon"><Icon type="star" /></span>
                    <div className="work-experience">
                      <h2 className="after-underline">Work</h2>
                      <div className="m-b-10 m-t-15">
                        <h3>Spotify New York</h3>
                        <span>2015 - Present</span>
                      </div>
                      <p className="m-b-25">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        <br />{' '}

                        {' '}
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
                      </p>
                      <div className="m-b-10 m-t-15">
                        <h3>Metropolitan Museum</h3>
                        <span>2013 - 2015</span>
                      </div>
                      <p className="m-b-25">
                        It is a long established fact that a reader will be distracted
                        {' '}
                        by the readable content of a page when looking at its layout. The point of using
                        {' '}
                        Lorem Ipsum is that it has a more-or-less normal distribution of letters,
                        {' '}
                        as opposed to using
                      </p>
                    </div>

                    <h2 className="after-underline">Rankings</h2>
                    <div className="d-flex align-items-center user-ratings">
                      <h1 className="m-r-10">8.6</h1>
                      <Icon type="star" theme="filled" />
                      <Icon type="star" theme="filled" />
                      <Icon type="star" theme="filled" />
                      <Icon type="star" theme="filled" />
                      <Icon type="star" theme="filled" />
                    </div>
                    <div className="m-t-25">
                      <h2 className="after-underline">Skills</h2>
                      <List
                        dataSource={data}
                        renderItem={item => (
                          <List.Item className="skill-item">{item}</List.Item>
                        )}
                      />
                    </div>
                    <div className="m-t-30 m-b-30 user-buttons">
                      <Button><Icon type="message" /> Send Message</Button>
                      <Button><Icon type="check" /> Contacts</Button>
                      <Button>Report User</Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

          </Col>

        </Row>

      </Layouts>
    );
  }
}

export default Profile;
