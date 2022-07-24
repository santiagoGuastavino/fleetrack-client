const properties = [
  {
    id: 1,
    address: '7187 Morapa Dr.',
    price: '$4.354.365',
    img: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/suburban-house-royalty-free-image-1584972559.jpg'
  },
  {
    id: 2,
    address: '1301 Dolphin Terrace',
    price: '$4.354.365',
    img: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/suburban-house-royalty-free-image-1584972559.jpg'
  },
  {
    id: 3,
    address: '215 Milford Dr.',
    price: '$4.354.365',
    img: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/suburban-house-royalty-free-image-1584972559.jpg'
  },
  {
    id: 4,
    address: '9315 Nightingale Dr.',
    price: '$4.354.365',
    img: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/suburban-house-royalty-free-image-1584972559.jpg'
  },
  {
    id: 5,
    address: '14935 Sutton Stº',
    price: '$4.354.365',
    img: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/suburban-house-royalty-free-image-1584972559.jpg'
  },
  {
    id: 6,
    address: '215 Milford Dr.',
    price: '$4.354.365',
    img: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/suburban-house-royalty-free-image-1584972559.jpg'
  }
]

export function getData (req, res, next) {
  res.status(200).json(properties)
}
