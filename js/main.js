let arrImages = [];
let RandomLike = 0;
let lengthImages = 25;
let lengthIdCommentStart = lengthImages + 1;
let NAMES=[
  "Дарья Рязанова",
  "Валерий Ладогубец",
  "Андрей Ботанов",
  "Максим Богданов",
  "Анна Азбукина",
  "Виктория Ташбулатова"
]
let MESSAGE=[
  "Всё отлично!",
  "В целом всё неплохо. Но не всё.",
  "Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.",
  "Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.",
  "Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.",
  "Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!"
];
for (let i = 1; i <= 25; i++)
{
  RandomLike = getRandomIntegerByRange(15, 200);

  let ArrayComments = [];
  for (let j = 1; j <= 6; j++)
  {
    let IdAvatar = getRandomIntegerByRange(1, 6);
    let messageIndex = getRandomIntegerByRange( 0, MESSAGE.length - 1);
    let namesIndex = getRandomIntegerByRange( 0, NAMES.length - 1);
    let CommentObject = {
      id: lengthIdCommentStart++,
      avatar: `img/avatar-${IdAvatar}.svg`,
      message: MESSAGE[messageIndex],
      name: NAMES[namesIndex],
    }
    ArrayComments.push(CommentObject);
  }
  let object = {
    id: i,
    url: `photos/${i}.jpg`,
    description: "Здесь находится описание фотографии",
    likes: RandomLike,
    comments: ArrayComments,
  }
  arrImages.push(object);
}
function getRandomIntegerByRange(min, max)
{
  return Math.floor( Math.random() * (max - min) + min );
}
