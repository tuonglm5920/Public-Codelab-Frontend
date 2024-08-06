import { useGetAvatarDropdown } from '../hooks/useGetAvatarDropdown';
import { SessionData } from '~/packages/common/Auth/models/SessionData';
import { Dropdown } from '~/shared/reactjs';
import { Image } from '~/shared/remixjs/client';

interface Props {
  sessionData: SessionData;
}

export const UserDropdown = ({ sessionData }: Props) => {
  const avatarDropdownItems = useGetAvatarDropdown();
  return (
    <Dropdown items={avatarDropdownItems}>
      <div className="flex cursor-pointer items-center gap-2">
        <div className="flex size-[40px] shrink-0 items-center justify-center overflow-hidden rounded-full">
          <Image
            loaderUrl="/public/images"
            src={sessionData?.profile?.avatar || '/assets/images/avatar.png'}
            width={40}
            height={40}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-semibold">{sessionData?.profile?.fullName}</div>
        </div>
      </div>
    </Dropdown>
  );
};
