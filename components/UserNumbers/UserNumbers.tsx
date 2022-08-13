import { useState } from "react";
import BaseModal from "../BaseModal/BaseModal";
import NumberOf from "../NumberOf/NumberOf";
import UserList from "../UserList/UserList";
import { Wrapper } from "./UserNumbers.styled";

const UserNumbers = ({ username, posts, followers, following }) => {
  const [followersModalIsOpen, setFollowersModalIsOpen] = useState(false);
  const [followingModalIsOpen, setFollowingModalIsOpen] = useState(false);

  const openFollowersModal = () => setFollowersModalIsOpen(true);
  const closeFollowersModal = () => setFollowersModalIsOpen(false);

  const openFollowingModal = () => setFollowingModalIsOpen(true);
  const closeFollowingModal = () => setFollowingModalIsOpen(false);

  return (
    <Wrapper>
      <NumberOf name="posts" length={posts?.length} />
      <NumberOf
        name="followers"
        length={followers?.length}
        clickHandler={openFollowersModal}
      />
      <BaseModal
        isOpen={followersModalIsOpen}
        onRequestClose={closeFollowersModal}
        contentLabel="Followers Modal"
        heading="Followers"
        close={closeFollowersModal}
      >
        <UserList username={username} users={followers} />
      </BaseModal>
      <NumberOf
        name="following"
        length={following?.length}
        clickHandler={openFollowingModal}
      />
      <BaseModal
        isOpen={followingModalIsOpen}
        onRequestClose={closeFollowingModal}
        contentLabel="Following Modal"
        heading="Following"
        close={closeFollowingModal}
      >
        <UserList username={username} users={following} />
      </BaseModal>
    </Wrapper>
  );
};

export default UserNumbers;
