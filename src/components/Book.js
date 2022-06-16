import React from 'react';

const Book = (props) => {
	let imageUrl;
	if (props.Book.imageLinks !== undefined) {
		imageUrl = props.Book.imageLinks.thumbnail;
	} else {
		imageUrl =
			'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
	}
	return (
		<div className='book'>
			<div className='book-top'>
				<div
					className='book-cover'
					style={{
						width: 128,
						height: 193,
						backgroundImage: `url(${imageUrl})`,
					}}
				/>
				<div className='book-shelf-changer'>
					<select
						value={props.Book.shelf}
						onChange={(e) =>
							props.changeHandler(e, JSON.stringify(props.Book))
						}>
						<option value='move' disabled>
							Move to...
						</option>
						<option value='currentlyReading'>Currently Reading</option>
						<option value='wantToRead'>Want to Read</option>
						<option value='read'>Read</option>
						<option value='none'>None</option>
					</select>
				</div>
			</div>
			<div className='book-title'>{props.Book.title.slice(0, 25)}</div>
			<div className='book-authors'>
				{props.Book.authors !== undefined
					? props.Book.authors.map((author) =>
							props.Book.authors[props.Book.authors.length - 1] === author ? (
								<span key={author}>{author}</span>
							) : (
								<span key={author}>{author}, </span>
							),
					  )
					: 'No Authors Avaliable'}
				{}
			</div>
			<div className='book-authors'>
				<p style={{ margin: '0px', opacity: '0.7' }}>{props.Book.shelf}</p>
			</div>
		</div>
	);
};
export default Book;
