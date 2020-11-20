import React, { useEffect, useState } from 'react';
import { history } from 'react-router-dom';
const Join = props => {
	const [nickname, setNickName] = useState('');
	const { history } = props;

	const handleKeyDown = event => {
		if (event.key === 'Enter') {
			if (nickname !== String.empty) {
				history.push(`/chat?nickname=${nickname}`);
			}
		}
	};

	useEffect(() => {
		let a = null;
		if (document.getElementById('q'))
			a = setInterval(() => {
				document.getElementById('q').focus();
			}, 100);
		return () => {
			clearInterval(a);
		};
	}, []);

	return (
		<div className='join'>
			<div>
				<label htmlFor='nameuser'> What 's your nickname? </label>
				<input
					id='q'
					type='text'
					name='nameuser'
					onChange={e => setNickName(e.target.value)}
					onKeyDown={handleKeyDown}
					autoFocus
				/>
			</div>
		</div>
	);
};

export default Join;
