import React, { useEffect, useMemo, useState } from 'react';
import qs from 'query-string';
import io from 'socket.io-client';
let socket = null;
const ENDPOINT = 'http://localhost:5000/';
const Chat = props => {
	const [textMessage, setTextMessage] = useState('');
	const [message, setMessage] = useState([]);
	const { nickname } = qs.parse(props.location.search);
	const [listUserIsTyping, setListUserIsTyping] = useState({});

	const randomColor = useMemo(() => {
		const a = Math.floor(Math.random() * 255);
		const b = Math.floor(Math.random() * 255);
		const c = Math.floor(Math.random() * 255);
		return { a, b, c };
	}, []);

	useEffect(() => {
		socket = io(ENDPOINT);
		const { a, b, c } = randomColor;
		socket.emit('join-room-chat', {
			nickname,
			color: `rgb(${a},${b},${c})`,
		});

		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	}, [nickname]);

	useEffect(() => {
		socket.on('res-message', mess => {
			if (mess) {
				setMessage(message => [...message, mess]);
			}
		});
	}, []);

	const removeTyping = mess => {
		const clone = { ...listUserIsTyping };
		delete clone[mess.id];
		setListUserIsTyping(clone);
	};

	useEffect(() => {
		socket.on('res-typing-off', mess => {
			removeTyping(mess);
		});
	}, []);

	useEffect(() => {
		socket.on('res-typing-on', mess => {
			setListUserIsTyping(listUserIsTyping => ({
				...listUserIsTyping,
				[mess.id]: { ...mess },
			}));
		});
	}, []);

	useEffect(() => {
		if (!textMessage) {
			socket.emit('typing-off', {}, mess => {
				removeTyping(mess);
			});
		}
	}, [textMessage]);
	useEffect(() => {
		if (textMessage) {
			socket.emit('typing-on');
		}
	}, [textMessage]);

	const onSendMessage = e => {
		if (e.key === 'Enter') {
			if (textMessage) {
				socket.emit('send-message', textMessage, color => {
					setTextMessage('');
					setMessage([
						...message,
						{ user: nickname, text: textMessage, color: color.color },
					]);
				});
			}
		}
	};
	return (
		<div className='chat-room'>
			<div className='conversation'>
				{message.map((mess, index) => (
					<div key={index}>
						{' '}
						<p className='name-user' style={{ color: mess.color }}>
							{mess.user}
						</p>{' '}
						<span> : </span>
						<p style={{ paddingLeft: '5px' }}> {mess.text} </p>
					</div>
				))}
				{Object.values(listUserIsTyping).map(l => (
					<div key={l.id}>
						{' '}
						<p className='name-user' style={{ color: l.color }}>
							{l.user}
						</p>{' '}
						<span> : </span>
						<p style={{ paddingLeft: '5px' }}> {l.status} </p>
					</div>
				))}
			</div>
			<div className='input-text'>
				<input
					type='text'
					value={textMessage}
					onChange={e => {
						setTextMessage(message => e.target.value);
					}}
					onKeyPress={onSendMessage}
				/>
			</div>
		</div>
	);
};

export default Chat;
