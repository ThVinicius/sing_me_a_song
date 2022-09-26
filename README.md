# projeto21-sing me a song

In this project I was given the task of doing the unit tests, integration and e2e

<p align="center">
  <img  src="https://pics.freeicons.io/uploads/icons/png/15441243016354192294521-512.png">
</p>
<h1 align="center">
  Sing me a song
</h1>
<div align="center">

  <h3>Built With</h3>

  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px"/>  
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express.js&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white" height="30px"/>

  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>

<br/>

# Description

Sing me a song is an application for anonymous song recommendation. The more people like a recommendation, the more likely it is to be recommended to others.

</br>

## Testes

- unitary [(backEnd)](https://github.com/ThVinicius/sing_me_a_song_backEnd)
- integration [(backEnd)](https://github.com/ThVinicius/sing_me_a_song_backEnd)
- e2e [(frontEnd)](https://github.com/ThVinicius/sing_me_a_song_frontEnd)

</br>

## API Reference

### Create recommendation

```http
POST /recommendations
```

<h3>Request:</h3>

| Params        | Type     | Description                    |
| :------------ | :------- | :----------------------------- |
| `name`        | `string` | **Required**                   |
| `youtubeLink` | `string` | **Required**, **youtube link** |

<h3>Response:</h3>

<h3>Error cases:</h3>

| Status code | Cause                                             |
| :---------- | :------------------------------------------------ |
| `400`       | _Request in wrong format_                         |
| `409`       | _try to register with an name already registered_ |

<h3>Success case (status code <span style="color:green">201</span>)</h3>

#

### Add a point to the recommendation score.

```http
POST /recommendations/:id/upvote
```

<h3>Response:</h3>

<h3>Error cases:</h3>

| Status code | Cause          |
| :---------- | :------------- |
| `404`       | _id not found_ |

<h3>Success case (status code <span style="color:green">200:</span>)</h3>

#

### Removes one point from the recommendation score.

If the score falls below -5, the recommendation should be deleted.

```http
POST /recommendations/:id/downvote
```

<h3>Response:</h3>

<h3>Error cases:</h3>

| Status code | Cause          |
| :---------- | :------------- |
| `404`       | _id not found_ |

<h3>Success case (status code <span style="color:green">200:</span>)</h3>

#

### Get all the last 10 recommendations.

```http
GET /recommendations
```

<h3>Response:</h3>

<h3>Success case (status code <span style="color:green">200:</span>)</h3>

```json
[
  {
    "id": 1,
    "name": "Chitãozinho E Xororó - Evidências",
    "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    "score": 245
  }
]
```

#

### Get a recommendation by your ID.

```http
GET /recommendations/:id
```

<h3>Response:</h3>

<h3>Error cases:</h3>

| Status code | Cause          |
| :---------- | :------------- |
| `404`       | _id not found_ |

<h3>Success case (status code <span style="color:green">200:</span>)</h3>

```json
{
  "id": 1,
  "name": "Chitãozinho E Xororó - Evidências",
  "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
  "score": 245
}
```

#

### Take a random recommendation.

- **70% of the times they hit this route**: a song with a score greater than 10 should be randomly recommended
- **30% of the times they hit this route**: a song with a score between -5 and 10 (inclusive), should be randomly recommended
- If there are only songs with a score above 10 or only below/equal to 10, 100% of the time any song must be drawn
- If there is no song registered, status 404 must be returned

```http
GET /recommendations/random
```

<h3>Response:</h3>

<h3>Success case (status code <span style="color:green">200:</span>)</h3>

```json
{
	"id": 1,
	"name": "Chitãozinho E Xororó - Evidências",
	"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
	"score": 245
},
```

#

### List the best recommendations.

- Lists the songs with the most points and their score. Top x songs are returned (parameter :amount of the route), ordered by score (highest first)

```http
GET /recommendations/top/:amount
```

<h3>Response:</h3>

<h3>Success case (status code <span style="color:green">200:</span>)</h3>

```json
[
	{
		"id": 150,
		"name": "Chitãozinho E Xororó - Evidências",
		"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
		"score": 245
	},
	{
		"id": 12,
		"name": "Falamansa - Xote dos Milagres",
		"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
		"score": 112
	},
	...
]
```

#

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName`

`PORT = number #recommended:5000`

`NODE_ENV = string #TEST if it is a dev environment`

</br>

## Run Locally

Clone the project

```bash
  git clone https://github.com/ThVinicius/sing_me_a_song_backEnd.git
```

Go to the project directory

```bash
  cd sing_me_a_song_backEnd
```

Install dependencies

```bash
  npm install
```

Create database

```bash
  npx prisma migrate dev
```

Start the server

```bash
  npm run start
```

Run tests

```bash
  npm test
```

</br>

## Acknowledgements

- [Awesome Badges](https://github.com/Envoy-VC/awesome-badges)

</br>

## Authors

- Vinicius Pacheco is a student at Driven Education and is putting effort into it to switch careers. Nowadays he works with Engineering,
  looking forward to become a Dev.
  <br/>

#
