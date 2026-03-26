import './globals.css';
import ConfigureAmplifyClientSide from './components/ConfigureAmplify';
import AuthenticatorProvider from './components/AuthenticatorProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConfigureAmplifyClientSide />
        <AuthenticatorProvider>
          {children}
        </AuthenticatorProvider>
      </body>
    </html>
  );
}