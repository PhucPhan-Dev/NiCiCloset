import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Profile from './Profile';
import ShippingAddressList from './ShippingAddress';

import Typography from 'components/atoms/Typography';
import Container from 'components/organisms/Container';
import Section from 'components/organisms/Section';
import { logoutService } from 'services/authenticate';
import { removeAccessToken, removeRefreshToken } from 'services/common/storage';
import { useAppSelector } from 'store/hooks';
import mapModifiers from 'utils/functions';

const menu = [
  {
    id: 1,
    text: 'Thông tin tài khoản'
  },
  {
    id: 2,
    text: 'Đơn hàng'
  },
  {
    id: 3,
    text: 'Địa chỉ'
  },
];

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(1);
  const profile = useAppSelector((state) => state.auth.profile);

  useEffect(() => {
    if (!profile) {
      navigate('/authenticate');
    }
  }, [navigate, profile]);

  const { mutate: logoutMutate } = useMutation(
    'logoutAction',
    logoutService,
    {
      onSuccess: () => {
        removeAccessToken();
        removeRefreshToken();
        navigate('/authenticate');
      },
      onError: () => {
        toast.error('Đã có lỗi xảy ra!', { toastId: 'logoutFail' });
      }
    }
  );

  return (
    <Section>
      <div className="p-account">
        <Container>
          <Row>
            <Col lg={3}>
              <div className="p-account_menu">
                <div className="p-account_menu_head">
                  <Typography.Text>
                    Xin chào,
                    {' '}
                    <br />
                    {' '}
                    <Typography.Text type="span" modifiers={['700']}>{profile?.fullName}</Typography.Text>
                  </Typography.Text>
                </div>
                {menu.map((item) => (
                  <div
                    className={mapModifiers('p-account_menu_item', item.id === active && 'active')}
                    key={item.id}
                    onClick={() => setActive(item.id)}
                  >
                    <Typography.Text>{item.text}</Typography.Text>
                  </div>
                ))}
                <div className="p-account_menu_item" onClick={() => logoutMutate()}>
                  <Typography.Text>Đăng xuất</Typography.Text>
                </div>
              </div>
            </Col>
            <Col lg={9}>
              {(() => {
                switch (active) {
                  case 1:
                    return <Profile />;
                  case 2:
                    return 'Not yet';
                  case 3:
                    return <ShippingAddressList />;
                  default:
                    return null;
                }
              })()}
            </Col>
          </Row>
        </Container>
      </div>
    </Section>
  );
};

export default Account;
