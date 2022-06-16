import React from 'react';
import Book from './Book';

const Section = (props) => {
	return (
		<div className='bookshelf'>
			<h2 className='bookshelf-title'>{props.section.name}</h2>
			<div className='bookshelf-books'>
				<ol className='books-grid'>
					{/* Books */}
					{props.Books.filter((book) => book.shelf === props.section.shelf).map(
						(book) => (
							<li key={book.id}>
								<Book Book={book} changeHandler={props.changeHandler} />
							</li>
						),
					)}
				</ol>
			</div>
		</div>
	);
};

export default Section;
