import classNames from 'classnames';
import { Image } from '~/shared/remixjs/client';

interface Props {
  collapsed: boolean;
}

export const Logo = ({ collapsed }: Props) => {
  return (
    <Image
      loaderUrl="/public/images"
      width={187}
      height={40}
      src={collapsed ? '/assets/images/logo-small.svg' : '/assets/images/logo.jpg'}
      alt="Logo"
      className={classNames('inline-block my-3', collapsed ? '!w-full' : '')}
    />
  );
};
