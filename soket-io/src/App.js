import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Join from './Join';
import Chat from './Chat';
function App() {
	return (
		<div className='App'>
			<Router>
				{' '}
				<Switch>
					<Route path='/join' exact component={Join}></Route>
					<Route path='/chat' exact component={Chat}></Route>
					<Route path='/'></Route>
				</Switch>{' '}
			</Router>
		</div>
	);
}

export default App;
