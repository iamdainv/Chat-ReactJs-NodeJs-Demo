const users = [];

const addUser = ({ id, name, color }) => {
	//javascript mastery = javascriptmastery

	name = name.trim().toLowerCase();
	const user = { id, name, color };
	users.push(user);

	return { user };
};

const removeUser = ({ id }) => {
	//javascript mastery = javascriptmastery

	name = name.trim().toLowerCase();
	const userIdx = users.findIndex(user => user.id === id);
	if (userIdx !== -1) {
		user.splice(userIdx, 1);
	}
};

const getUser = ({ id }) => {
	return users.find(u => (u.id = id));
};
const getUserInRoom = () => {
	return users.length();
};

module.exports = { removeUser, addUser, getUserInRoom, getUser, users };
