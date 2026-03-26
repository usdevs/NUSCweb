import './telegram-login-button.css';

import { Roboto } from 'next/font/google';

export const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
});

export default function LocalLoginButton() {
  return (
    <div
      className={`${roboto.className} widget_frame_base tgme_widget body_widget_login`}
    >
      <div className='tgme_widget_login large'>
        <button
          className='btn tgme_widget_login_button'
          onClick={() => window.location.replace('/api/auth/callback')}
        >
          <i className='tgme_widget_login_button_icon' />
          Login locally
        </button>
        <i
          className='tgme_widget_login_user_photo bgcolor0'
          data-content='Test'
          onClick={() => window.location.replace('/api/auth/callback')}
        />
      </div>
    </div>
  );
}
