using System;
using Moq;
using NUnit.Framework;
using Saityno_back_end;
using Saityno_back_end.Controllers;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;

namespace Testavimas.Controllers
{
	[TestFixture]
	public class ContinentsControllerTests
	{
		private Mock<saitynasEntities2> mockContext;

		private Mock<TestDbSet<continent>> mockSet;

		private Mock<TestDbSet<team>> mockSet2;

		private Mock<TestDbSet<player>> mockSet3;

		Random rnd = new Random();

		private int count = 3;

		[SetUp]
		public void SetUp()
		{
			this.mockSet = new Mock<TestDbSet<continent>>();
			this.mockSet2 = new Mock<TestDbSet<team>>();
			this.mockSet3 = new Mock<TestDbSet<player>>();
			this.mockContext = new Mock<saitynasEntities2>();
			var data = GetAllContinents().AsQueryable();
			var data2 = GetAllTeams().AsQueryable();
			var data3 = GetAllPlayers().AsQueryable();

			mockSet.As<IQueryable<continent>>().Setup(m => m.Provider).Returns(data.Provider);
			mockSet.As<IQueryable<continent>>().Setup(m => m.Expression).Returns(data.Expression);
			mockSet.As<IQueryable<continent>>().Setup(m => m.ElementType).Returns(data.ElementType);
			mockSet.As<IQueryable<continent>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());

			mockSet2.As<IQueryable<team>>().Setup(m => m.Provider).Returns(data2.Provider);
			mockSet2.As<IQueryable<team>>().Setup(m => m.Expression).Returns(data2.Expression);
			mockSet2.As<IQueryable<team>>().Setup(m => m.ElementType).Returns(data2.ElementType);
			mockSet2.As<IQueryable<team>>().Setup(m => m.GetEnumerator()).Returns(data2.GetEnumerator());

			mockSet3.As<IQueryable<player>>().Setup(m => m.Provider).Returns(data3.Provider);
			mockSet3.As<IQueryable<player>>().Setup(m => m.Expression).Returns(data3.Expression);
			mockSet3.As<IQueryable<player>>().Setup(m => m.ElementType).Returns(data3.ElementType);
			mockSet3.As<IQueryable<player>>().Setup(m => m.GetEnumerator()).Returns(data3.GetEnumerator());


			mockContext.Setup(c => c.continents).Returns(mockSet.Object);
			mockContext.Setup(c => c.teams).Returns(mockSet2.Object);
			mockContext.Setup(c => c.players).Returns(mockSet3.Object);

		}

		#region Generating data

		private List<continent> GetAllContinents()
		{
			var list = new List<continent>();
			int id = 1;
			for (int i = 0; i < count; i++)
			{
				list.Add(new continent
					{id = id, name = "Test" + (id++).ToString(), teams = GetAllContinentTeams(i)});
			}

			return list;
		}

		private List<team> GetAllTeams()
		{
			var list = new List<team>();
			int id = 1;
			for (int i = 0; i < count; i++)
			for (int k = 0; k < count; k++)
				list.Add(new team
				{
					id = id,
					name = "team" + (id).ToString(),
					wins = rnd.Next(1, 100),
					defeats = rnd.Next(1, 100),
					fk_continent = i + 1,
					players = GetAllTeamPlayers(id++)
				});

			return list;
		}

		private List<player> GetAllPlayers()
		{
			var list = new List<player>();
			int id = 1;
			for (int i = 0; i < count; i++)
			for (int k = 0; k < count; k++)
			for (int j = 0; j < count; j++)
				list.Add(new player
				{
					id = id,
					username = "player" + (id).ToString(),
					first_name = "player" + (id).ToString(),
					last_name = "player" + (id).ToString(),
					country = "player" + (id++).ToString(),
					age = rnd.Next(18, 30),
					fk_team = k + 1
				});
			return list;
		}

		private List<team> GetAllContinentTeams(int id)
		{
			List<team> list = new List<team>();

			for (int i = 0; i < count; i++)
				list.Add(new team
				{
					id = id * count + i + 1,
					name = "team" + (id * count + i + 1).ToString(),
					wins = rnd.Next(1, 100),
					defeats = rnd.Next(1, 100),
					fk_continent = id + 1,
					players = GetAllTeamPlayers(id * count + i + 1)
				});

			return list;
		}

		private List<player> GetAllTeamPlayers(int n)
		{
			List<player> list = new List<player>();

			for (int i = 0; i < count; i++)
				list.Add(new player
				{
					id = (n - 1) * count + i + 1,
					username = "player" + ((n - 1) * count + i + 1d).ToString(),
					first_name = "player" + ((n - 1) * count + i + 1).ToString(),
					last_name = "player" + ((n - 1) * count + i + 1d).ToString(),
					country = "player" + ((n - 1) * count + i + 1).ToString(),
					age = rnd.Next(18, 30),
					fk_team = n
				});

			return list;
		}

		#endregion

		private ContinentsControllerTest CreateContinentsController()
		{
			return new ContinentsControllerTest(mockContext.Object);
		}

		//------------------------
		//       Continents
		//------------------------

		#region Continent controller

		[Test]
		public void GetAllContinents_Returns_AllContinents()
		{
			// Arrange
			var continentsController = this.CreateContinentsController();

			// Act
			var result = continentsController.Getcontinents();

			// Assert
			Assert.AreEqual(count, result.Count());
		}

		[Test]
		public void GetContinent_Returns_Continent()
		{
			// Arrange
			var continentsController = this.CreateContinentsController();

			// Act
			var result = continentsController.Getcontinent(2) as OkNegotiatedContentResult<continent>;

			// Assert
			Assert.IsNotNull(result);
			Assert.AreEqual(2, result.Content.id);
			Assert.AreEqual("Test2", result.Content.name);
		}

		[Test]
		public void GetContinent_Returns_NotFound()
		{
			// Arrange
			var continentsController = this.CreateContinentsController();

			// Act
			var result = continentsController.Getcontinent(7);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<NotFoundResult>(result);
		}

		[Test]
		public void PutContinent_Returns_NoContent()
		{
			// Arrange
			var continentsController = this.CreateContinentsController();
			int id = 2;
			continent continent = new continent {id = 2, name = "Test6"};

			// Act
			var result = continentsController.Putcontinent(
				id,
				continent) as StatusCodeResult;


			// Assert
			Assert.AreEqual(HttpStatusCode.NoContent, result.StatusCode);
		}

		[Test]
		public void PutContinent_Returns_BadRequest()
		{
			// Arrange
			var continentsController = this.CreateContinentsController();
			int id = 5;
			continent continent = new continent {id = 6, name = "Test6"};

			// Act
			var result = continentsController.Putcontinent(id, continent);


			// Assert
			Assert.IsInstanceOf<BadRequestResult>(result);
		}

		[Test]
		public void PutContinent_Returns_NotFound()
		{
			// Arrange
			var continentsController = this.CreateContinentsController();
			int id = 8;
			continent continent = new continent {id = 8, name = "Test6"};

			// Act
			var result = continentsController.Putcontinent(id, continent);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<NotFoundResult>(result);
		}

		[TestCase(10, null)]
		public void PutContinent_Return_NotValid(int id, string name)
		{
			// Arrange
			var continentsController = this.CreateContinentsController();
			continent continent = new continent {id = id, name = name};

			continentsController.ModelState.AddModelError("name", "bad name");
			// Act
			var result = continentsController.Putcontinent(id, continent);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<InvalidModelStateResult>(result);
		}

		[Test]
		public void DeleteContinent_Returns_DeletedContinent()
		{
			// Arrange
			var continentsController = this.CreateContinentsController();
			continentsController.Request = new HttpRequestMessage();
			continentsController.Configuration = new HttpConfiguration();
			int id = 3;

			// Act
			var result = continentsController.Deletecontinent(id) as OkNegotiatedContentResult<continent>;

			// Assert
			Assert.IsNotNull(result);
			Assert.IsNotNull(result.Content);
			Assert.AreEqual(id, result.Content.id);
		}

		[Test]
		public void DeleteContinent_Returns_NotFound()
		{
			// Arrange
			var continentsController = this.CreateContinentsController();
			int id = 8;

			// Act
			var result = continentsController.Deletecontinent(id);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<NotFoundResult>(result);
		}

		[Test]
		public void PostContinent_Returns_PostedContinent()
		{
			// Arrange
			var continentsController = this.CreateContinentsController();
			continentsController.Request = new HttpRequestMessage();
			continentsController.Configuration = new HttpConfiguration();
			continent continent = new continent {id = 6, name = "Test6"};

			// Act
			var result = continentsController.Postcontinent(continent) as OkNegotiatedContentResult<continent>;

			// Assert
			Assert.IsNotNull(result);
			Assert.IsNotNull(result.Content);
			Assert.AreEqual(6, result.Content.id);
			Assert.AreEqual("Test6", result.Content.name);
		}

		[TestCase(10, null)]
		public void PostContinent_Return_NotValid(int id, string name)
		{
			// Arrange
			var continentsController = this.CreateContinentsController();
			continent continent = new continent {id = id, name = name};

			continentsController.ModelState.AddModelError("name", "bad name");
			// Act
			var result = continentsController.Postcontinent(continent);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<InvalidModelStateResult>(result);
		}

		#endregion 

		//------------------------
		//         Teams
		//------------------------

		#region Teams controller
		[Test]
		public void GetAllTeams_Returns_AllTeams()
		{
			// Arrange
			var teamsController = this.CreateContinentsController();

			// Act
			var result = teamsController.Getteams(1) as OkNegotiatedContentResult<List<team>>;

			// Assert
			Assert.AreEqual(count, result.Content.Count());
		}

		[Test]
		public void GetTeam_Returns_Team()
		{
			// Arrange
			var teamsController = this.CreateContinentsController();

			// Act
			var result = teamsController.Getteam(1, 2) as OkNegotiatedContentResult<team>;

			// Assert
			Assert.IsNotNull(result);
			Assert.AreEqual(2, result.Content.id);
			Assert.AreEqual("team2", result.Content.name);
		}

		[TestCase(1, 7)]
		[TestCase(8, 4)]
		[TestCase(2, 45)]
		public void GetTeam_Returns_NotFound(int id, int tid)
		{
			// Arrange
			var teamsController = this.CreateContinentsController();

			// Act
			var result = teamsController.Getteam(id, tid);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<NotFoundResult>(result);
		}

		[Test]
		public void PutTeam_Returns_NoContent()
		{
			// Arrange
			var teamsController = this.CreateContinentsController();
			int id = 3;
			team team = new team {id = id, name = "team6"};

			// Act
			var result = teamsController.Putteam(1,
				id,
				team) as StatusCodeResult;


			// Assert
			Assert.AreEqual(HttpStatusCode.NoContent, result.StatusCode);
		}

		[Test]
		public void PutTeam_Returns_BadRequest()
		{
			// Arrange
			var teamsController = this.CreateContinentsController();
			int id = 5;
			team team = new team {id = 6, name = "team6"};

			// Act
			var result = teamsController.Putteam(2, id, team);


			// Assert
			Assert.IsInstanceOf<BadRequestResult>(result);
		}

		[TestCase(1, 7)]
		[TestCase(8, 4)]
		[TestCase(2, 45)]
		public void PutTeam_Returns_NotFound(int id, int tid)
		{
			// Arrange
			var teamsController = this.CreateContinentsController();
			team team = new team {id = tid, name = "team6"};

			// Act
			var result = teamsController.Putteam(id, tid, team);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<NotFoundResult>(result);
		}

		[TestCase(99, null)]
		public void PutTeam_Return_NotValid(int id, string name)
		{
			// Arrange
			var teamsController = this.CreateContinentsController();
			team team = new team {id = id, name = name};

			teamsController.ModelState.AddModelError("name", "bad name");
			// Act
			var result = teamsController.Putteam(1, id, team);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<InvalidModelStateResult>(result);
		}

		[Test]
		public void DeleteTeam_Returns_DeletedTeam()
		{
			// Arrange
			var teamsController = this.CreateContinentsController();
			teamsController.Request = new HttpRequestMessage();
			teamsController.Configuration = new HttpConfiguration();
			int id = 3;

			// Act
			var result = teamsController.Deleteteam(1, id) as OkNegotiatedContentResult<team>;

			// Assert
			Assert.IsNotNull(result);
			Assert.IsNotNull(result.Content);
			Assert.AreEqual(id, result.Content.id);
		}

		[TestCase(1, 7)]
		[TestCase(8, 4)]
		[TestCase(2, 45)]
		public void DeleteTeam_Returns_NotFound(int id, int tid)
		{
			// Arrange
			var teamsController = this.CreateContinentsController();

			// Act
			var result = teamsController.Deleteteam(id, tid);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<NotFoundResult>(result);
		}

		[Test]
		public void PostTeam_Returns_PostedTeam()
		{
			// Arrange
			var teamsController = this.CreateContinentsController();
			teamsController.Request = new HttpRequestMessage();
			teamsController.Configuration = new HttpConfiguration();
			team team = new team {id = 99, name = "team6"};

			// Act
			var result = teamsController.Postteam(1, team) as OkNegotiatedContentResult<team>;

			// Assert
			Assert.IsNotNull(result);
			Assert.IsNotNull(result.Content);
			Assert.AreEqual(99, result.Content.id);
			Assert.AreEqual("team6", result.Content.name);
		}

		[TestCase(99, null)]
		public void PostTeam_Return_NotValid(int id, string name)
		{
			// Arrange
			var teamsController = this.CreateContinentsController();
			team team = new team {id = id, name = name};

			teamsController.ModelState.AddModelError("name", "bad name");
			// Act
			var result = teamsController.Postteam(1, team);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<InvalidModelStateResult>(result);
		}

		#endregion

		//------------------------
		//        Players
		//------------------------

		#region Player controller
		[Test]
		public void GetAllPlayers_Returns_AllPlayers()
		{
			// Arrange
			var playersController = this.CreateContinentsController();

			// Act
			var result = playersController.Getplayers(1, 1) as OkNegotiatedContentResult<List<player>>;

			// Assert
			Assert.AreEqual(count, result.Content.Count());
		}

		[Test]
		public void GetPlayer_Returns_Player()
		{
			// Arrange
			var playersController = this.CreateContinentsController();

			// Act
			var result = playersController.Getplayer(1, 1, 2) as OkNegotiatedContentResult<player>;

			// Assert
			Assert.IsNotNull(result);
			Assert.AreEqual(2, result.Content.id);
			Assert.AreEqual("player2", result.Content.username);
		}

		[TestCase(1, 1, 7)]
		[TestCase(8, 4, 2)]
		[TestCase(1, 5, 7)]
		[TestCase(1, 3, 99)]
		public void GetPlayer_Returns_NotFound(int id, int tid, int pid)
		{
			// Arrange
			var playersController = this.CreateContinentsController();

			// Act
			var result = playersController.Getplayer(id, tid, pid);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<NotFoundResult>(result);
		}

		[Test]
		public void PutPlayer_Returns_NoContent()
		{
			// Arrange
			var playersController = this.CreateContinentsController();
			int id = 2;
			player player = new player {id = 2, username = "player6"};

			// Act
			var result = playersController.Putplayer(1, 1,
				id,
				player) as StatusCodeResult;


			// Assert
			Assert.AreEqual(HttpStatusCode.NoContent, result.StatusCode);
		}

		[Test]
		public void PutPlayer_Returns_BadRequest()
		{
			// Arrange
			var playersController = this.CreateContinentsController();
			int id = 5;
			player player = new player {id = 6, username = "player6"};

			// Act
			var result = playersController.Putplayer(1, 2, id, player);


			// Assert
			Assert.IsInstanceOf<BadRequestResult>(result);
		}

		[TestCase(1, 1, 7)]
		[TestCase(8, 4, 2)]
		[TestCase(1, 5, 7)]
		[TestCase(1, 3, 99)]
		public void PutPlayer_Returns_NotFound(int id, int tid, int pid)
		{
			// Arrange
			var playersController = this.CreateContinentsController();
			player player = new player {id = pid, username = "player6"};

			// Act
			var result = playersController.Putplayer(id, tid, pid, player);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<NotFoundResult>(result);
		}

		[TestCase(10, null, "test", "test", "test")]
		[TestCase(10, "test", "test", "test", null)]
		[TestCase(10, "test", "test", null, "test")]
		[TestCase(10, "test", null, "test", "test")]
		public void PutPlayer_Return_NotValid(int id, string name, string first, string second, string country)
		{
			// Arrange
			var playersController = this.CreateContinentsController();
			player player = new player
				{id = id, username = name, first_name = first, last_name = second, country = country};

			playersController.ModelState.AddModelError("username", "bad name");
			playersController.ModelState.AddModelError("first_name", "bad first_name");
			playersController.ModelState.AddModelError("last_name", "bad last_name");
			playersController.ModelState.AddModelError("country", "bad country");
			playersController.ModelState.AddModelError("age", "age not given");
			playersController.ModelState.AddModelError("fk_team", "fk_team not given");
			// Act
			var result = playersController.Putplayer(1, 1, id, player);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<InvalidModelStateResult>(result);
		}

		[Test]
		public void DeletePlayer_Returns_DeletedPlayer()
		{
			// Arrange
			var playersController = this.CreateContinentsController();
			playersController.Request = new HttpRequestMessage();
			playersController.Configuration = new HttpConfiguration();
			int id = 3;

			// Act
			var result = playersController.Deleteplayer(1, 1, id) as OkNegotiatedContentResult<player>;

			// Assert
			Assert.IsNotNull(result);
			Assert.IsNotNull(result.Content);
			Assert.AreEqual(id, result.Content.id);
		}

		[TestCase(1, 1, 7)]
		[TestCase(8, 4, 2)]
		[TestCase(1, 5, 7)]
		[TestCase(1, 3, 99)]
		public void DeletePlayer_Returns_NotFound(int id, int tid, int pid)
		{
			// Arrange
			var playersController = this.CreateContinentsController();

			// Act
			var result = playersController.Deleteplayer(id, tid, pid);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<NotFoundResult>(result);
		}

		[Test]
		public void PostPlayer_Returns_PostedPlayer()
		{
			// Arrange
			var playersController = this.CreateContinentsController();
			playersController.Request = new HttpRequestMessage();
			playersController.Configuration = new HttpConfiguration();
			player player = new player {id = 99, username = "player6"};

			// Act
			var result = playersController.Postplayer(1, 1, player) as OkNegotiatedContentResult<player>;

			// Assert
			Assert.IsNotNull(result);
			Assert.IsNotNull(result.Content);
			Assert.AreEqual(99, result.Content.id);
			Assert.AreEqual("player6", result.Content.username);
		}

		[TestCase(10, null)]
		public void PostPlayer_Return_NotValid(int id, string name)
		{
			// Arrange
			var playersController = this.CreateContinentsController();
			player player = new player {id = id, username = name};

			playersController.ModelState.AddModelError("name", "bad name");
			// Act
			var result = playersController.Postplayer(1, 1, player);

			// Assert
			Assert.IsNotNull(result);
			Assert.IsInstanceOf<InvalidModelStateResult>(result);
		}

		#endregion
	}
}