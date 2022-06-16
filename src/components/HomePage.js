import React from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';

const HomePage = (props) => {
	return (
		<div className='list-books'>
			<div className='list-books-title'>
				<h1>MyReads</h1>
			</div>
			<div className='list-books-content'>
				<div>
					{/* Book Shelf */}
					{props.HomeSections.map((section) => (
						<Section
							key={section.id}
							section={section}
							Books={props.Books}
							changeHandler={props.changeHandler}
						/>
					))}
				</div>
			</div>
			<div className='open-search'>
				<button className='open-search'>
					<Link className='open-search' to='/search'>
						Add a book
					</Link>
				</button>
			</div>
		</div>
	);
};

export default HomePage;
