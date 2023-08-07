import React, { useEffect, useState, useContext } from 'react'
import '../assets/sidebar.css'
import { Avatar, IconButton, Popper, Box, Button, Menu, MenuItem } from '@mui/material';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import MessageIcon from '@mui/icons-material/Message';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import SidebarChat from './SidebarChat';
import GroupsIcon from '@mui/icons-material/Groups';
import { useAuth0 } from "@auth0/auth0-react";
import DataContext from '../DataContext';
import axios from 'axios'


export default function Sidebar() {

  const { setChatMoreShow, refreshSidebar, setRefreshSidebar, setUserEmail, userEmail, setUserName, userName, roomID, setRoomID, setChatIconClicked, setChatName, prevChat, setOpenChat, privateNewMsg, setEmptyChat, setPrivateChatData, privateNewMsgRec } = useContext(DataContext);

  ///////////////////login authentication////////////////////
  const { loginWithRedirect } = useAuth0();
  const { logout } = useAuth0();
  const [groups, setGroups] = useState('')
  const [privateSidebar, setPrivateSidebar] = useState('')
  const [messages, setMessages] = useState('')

  const { user, isAuthenticated, isLoading } = useAuth0();

  if (!isLoading) {
    setUserName(user?.nickname)
    setUserEmail(user?.email)
  }

  ////////////////////////////////////////////////////////

  function handleClickChat(roomId, chatName, chatType) {
    console.log('clicked a chat sidebar')
    console.log('chatType: ', chatType)
    setRoomID(roomId) // using in chat.jsx component
    setChatName(chatName) // using in chat.jsx component
    setOpenChat(true) // using in app.js to toggle chat component
    setChatMoreShow(chatType)
  }


  function handlePrivateChatSent(privateRoomID, sender, recipient, chatType) {
    console.log('privateRoomID', privateRoomID)
    console.log('chatType: ', chatType)
    console.log('sender', sender)
    console.log('recipient', recipient)
    setRoomID(privateRoomID)
    setChatName(recipient)
    setOpenChat(true)
    setChatMoreShow(chatType)
    // setPrivateChatData({privateRoomID,recipient})
  }


  function handlePrivateChatReceive(privateRoomID, sender, recipient, chatType) {
    console.log('privateRoomID', privateRoomID)
    console.log('chatType: ', chatType)
    console.log('sender', sender)
    console.log('recipient', recipient)
    setRoomID(privateRoomID)
    setChatName(sender)
    setOpenChat(true)
    setChatMoreShow(chatType)
    // setPrivateChatData({privateRoomID,sender})

  }

  ///////////////////////////////////group chat//////////////////////////////////////

  async function handleGroupChatClick() {
    const groupName = prompt('Enter a name of group to create.');
    console.log('this is a name of a group: ', groupName);

    if (groupName) {
      try {
        setTimeout(() => {
          setRefreshSidebar((prev) => !prev);
        }, 1000)

        console.log('hitttttttttttttttttttttttt,,,', groupName);

        const response = await axios.post('http://localhost:32000/createGroup', {
          groupName,
          createdBy: userName,
        })

        console.log('response for group create: ', response?.data);

      } catch (error) {
        console.log('error occured on group create', error);
      }
    } else {
      return
    }

  }

  async function handlePrivateChatClick() {

    const name = prompt(`Please enter a name to start chatting.`);
    const recipientName = name && name.trim(); // Trim whitespace from the entered ID
    console.log('recipientName', recipientName)

    if (recipientName) {
      try {
        setTimeout(() => {
          setRefreshSidebar((prev) => !prev);
        }, 1000)

        console.log('hitttttttttttttttttttttttt,,,', recipientName);

        const response = await axios.post('http://localhost:32000/createPrivateRoom', {
          sender: userName,
          recipientName,
        })

        console.log('response for privateChat create: ', response?.data);

      } catch (error) {
        console.log('error occured on privateChat create', error);
      }
    } else {
      return
    }


  }


  /////////////////////////////route handlers///////////////////////////////////////////
  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:32000/getGroup');

        // console.log('response for group get: ', response?.data);
        setGroups(response?.data)
      } catch (error) {
        console.log('error occurred on group create', error);
      }
    };

    fetchData();
  }, [refreshSidebar]);




  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:32000/getPrivate');

        // console.log('response for private get: ', response?.data);
        setPrivateSidebar(response?.data)
      } catch (error) {
        console.log('error occurred on group create', error);
      }
    };

    fetchData();
  }, [refreshSidebar]);



  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:32000/getMessages');

        console.log('response for getMessages : ', response?.data);
        setMessages(response?.data)
      } catch (error) {
        console.log('error occurred on group create', error);
      }
    };

    fetchData();
  }, [refreshSidebar]);





  useEffect(() => {
    console.log('groups....', groups)
  }, [groups])
  ///////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////

  
  const allChats = [...privateNewMsg, ...privateNewMsgRec, ...groups, ...privateSidebar];

  
  allChats.sort((a, b) => a.timestamp - b.timestamp);
  ///////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className='sidebar'>
      <div className="sidebar_header">

        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Avatar src={isAuthenticated ? user.picture : ''} />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {isAuthenticated ? <>
            <MenuItem onClick={handleClose}>Hi, {user.nickname}</MenuItem>
            <MenuItem onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>LogOut</MenuItem></> :
            <MenuItem onClick={() => loginWithRedirect()}>LogIn</MenuItem>
          }
        </Menu>

        <div className="sidebar_headerRight">
          {/* <IconButton>
            <DonutLargeIcon />
          </IconButton> */}
          <IconButton onClick={handleGroupChatClick}>
            <GroupsIcon fontSize='medium' />
          </IconButton>
          <IconButton onClick={handlePrivateChatClick}>
            <MessageIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchIcon />
          <input type="text" placeholder='Enter name or start new chat' />
        </div>
      </div>
      <div id='newPrivateChats' className="sidebarChats">
        {/*           
        {Array.isArray(privateNewMsg) &&
          privateNewMsg.map((item, i) => {
            console.log('item....', item);
            return (
              <SidebarChat
                onClick={() => handleClickChat(item?.name, item?.name)}
                groupName={item?.name}
                lastmsg={item?.message?.message}
              />
            );
          })
        } */}

        {/* {Array.isArray(privateNewMsg) &&
          privateNewMsg.map((item, i) => {
            // console.log('item....', item);
            return (
              <SidebarChat
                onClick={() => handlePrivateChatSent( item?.privateRoomID, item?.sender,item?.recipient)}
                groupName={item?.recipient}
                lastmsg={'this is the last message'}
              />
            );
          })
        } */}

        {/* {Array.isArray(privateNewMsgRec) &&
          privateNewMsgRec.map((item, i) => {
            // console.log('item....', item);
            return (
              <SidebarChat
                onClick={() => handlePrivateChatReceive( item?.privateRoomID, item?.sender,item?.recipient)}
                groupName={item?.sender}
                lastmsg={'this is the last message'}
              />
            );
          })
        } */}

        {/* ///////////////////////group///////////////////////////// */}
        {/* groups.members.includes(userName) && */}
        {/* { Array.isArray(groups) &&
          groups.map((item, i) => {
            console.log('item....', item);
            if (item.members.includes(userName)) {
              return (
                <SidebarChat
                  onClick={() => handleClickChat( item?.roomID, item?.groupName)}
                  groupName={item?.groupName}
                  lastmsg={item?.lastMsg}
                />
              );
            }else {
              null
            }
            
          })
        } */}

        {/* ///////////////////////////////////////////////////////// */}


        {Array.isArray(allChats) &&
          allChats.map((item, i) => {
            if (item?.userName1 === userName || item?.userName2 === userName) {

              // console.log('messages from map', messages)
              return (
                <SidebarChat
                  key={item?.roomID}
                  onClick={() => {
                    if (item.userName1 === userName) {
                      handlePrivateChatSent(item.roomID, item.userName1, item.userName2, "private");
                    } else {
                      handlePrivateChatReceive(item.roomID, item.userName1, item.userName2, "private");
                    }
                  }}
                  groupName={item.userName1 === userName ? item.userName2 : item.userName1}
                  lastmsg={'this is the last message'}
                />
                
              );
            } else if (item.members && item.members.includes(userName)) {
              return (
                <SidebarChat
                  key={item.roomID}
                  onClick={() => handleClickChat(item.roomID, item.groupName, "group")}
                  groupName={item.groupName}
                  lastmsg={item.lastMsg}
                />
              );
            }
            return null;
          })}

        {/* ////////////////////////////////////////////////////////// */}

        <SidebarChat
          onClick={() => handleClickChat('chat1', 'Group 1', 'private')}
          groupName={'Group 1'}
          lastmsg={'group 1 last message'}
        />

        <SidebarChat
          onClick={() => handleClickChat('chatGroup1', 'Group 2', 'private')}
          groupName={'Group 2'}
          lastmsg={'group 2 last message'}
        />

        <SidebarChat
          onClick={() => handleClickChat('chatGroup2', 'Group 3', 'private')}
          groupName={'Group 3'}
          lastmsg={'group 3 last message'}
        />
      </div>
    </div>
  )
}
