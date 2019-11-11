using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Saityno_back_end;

namespace Saityno_back_end.Controllers
{
	public class ContinentsControllerTest : ApiController
	{
		private saitynasEntities2 db = new saitynasEntities2();

		///
		/// Constructor used by Moq
		///
		/// Repository
		public ContinentsControllerTest(saitynasEntities2 context)
		{
			db = context;
		}

		#region Continent api

		public IEnumerable<continent> Getcontinents()
		{
			return db.continents.ToList();
		}

		[ResponseType(typeof(continent))]
		public IHttpActionResult Getcontinent(int id)
		{
			//continent continent = db.continents.Find(id);

			//
			// FOR Moq
			//
			continent continent = db.continents.Where(x => x.id == id).FirstOrDefault();


			if (continent == null)
			{
				return NotFound();
			}

			return Ok(continent);
		}

		[Authorize(Roles = "admin")]
		[ResponseType(typeof(void))]
		public IHttpActionResult Putcontinent(int id, continent continent)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (id != continent.id)
			{
				return BadRequest();
			}

			db.Entry(continent).State = EntityState.Modified;

			if (!continentExists(id))
			{
				return NotFound();
			}
			else
			{
				db.SaveChanges();
			}

			return StatusCode(HttpStatusCode.NoContent);
		}

		[Authorize(Roles = "admin")]
		[ResponseType(typeof(continent))]
		public IHttpActionResult Postcontinent(continent continent)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			db.continents.Add(continent);
			db.SaveChanges();

			return Ok(continent);
		}

		[Authorize(Roles = "admin")]
		[ResponseType(typeof(continent))]
		public IHttpActionResult Deletecontinent(int id)
		{
			//continent continent = db.continents.Find(id);

			//
			// for moq
			//
			continent continent = db.continents.Where(l => l.id == id).FirstOrDefault();


			if (continent == null)
			{
				return NotFound();
			}

			for (int j = continent.teams.Count; j > 0; j--)
			{
				team team = continent.teams.Last();
				for (int i = team.players.Count; i > 0; i--)
				{
					player player = team.players.Last();
					if (player.rating != null)
						db.ratings.Remove(player.rating);
					db.players.Remove(player);
					db.SaveChanges();
				}

				db.teams.Remove(team);
				db.SaveChanges();
			}

			db.continents.Remove(continent);
			db.SaveChanges();

			return Ok(continent);
		}
		#endregion

		#region Team api
		[ResponseType(typeof(team))]
		[Route("api/continents/{id}/teams")]
		public IHttpActionResult Getteams(int id)
		{
			//continent continent = db.continents.Find(id);

			//
			// for moq
			//
			continent continent = db.continents.Where(l => l.id == id).FirstOrDefault();

			if (continent == null)
			{
				return NotFound();
			}

			return Ok(continent.teams.ToList());
		}

		[Route("api/continents/{id}/teams/{tid}")]
		[ResponseType(typeof(team))]
		public IHttpActionResult Getteam(int id, int tid)
		{
			//continent continent = db.continents.Find(id);

			//
			// for moq
			//
			continent continent = db.continents.Where(l => l.id == id).FirstOrDefault();

			if (continent == null)
			{
				return NotFound();
			}

			//team team = db.teams.Find(id);

			//
			// for moq
			//
			team team = db.teams.Where(l => l.id == tid).FirstOrDefault();

			if (team == null)
			{
				return NotFound();
			}


			/*if (!continent.teams.Contains(team))
			{
				return NotFound();
			}*/

			if (continent.teams.Where(x => x.id == team.id).FirstOrDefault() == null)
				return NotFound();


			return Ok(team);
		}

		[Authorize(Roles = "admin,manager")]
		[Route("api/continents/{id}/teams")]
		[ResponseType(typeof(team))]
		public IHttpActionResult Postteam(int id, team team)
		{
			//continent continent = db.continents.Find(id);

			//
			// for moq
			//
			continent continent = db.continents.Where(l => l.id == id).FirstOrDefault();

			if (continent == null)
			{
				return NotFound();
			}

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			db.teams.Add(team);
			db.SaveChanges();

			return Ok(team);
		}

		[Authorize(Roles = "admin,manager")]
		[Route("api/continents/{id}/teams/{tid}")]
		[ResponseType(typeof(team))]
		public IHttpActionResult Deleteteam(int id, int tid)
		{
			//continent continent = db.continents.Find(id);

			//
			// for moq
			//
			continent continent = db.continents.Where(l => l.id == id).FirstOrDefault();

			if (continent == null)
			{
				return NotFound();
			}

			//team team = db.teams.Find(id);

			//
			// for moq
			//
			team team = db.teams.Where(l => l.id == tid).FirstOrDefault();

			if (team == null)
			{
				return NotFound();
			}

			/*if (!continent.teams.Contains(team))
			{
				return NotFound();
			}*/

			if (continent.teams.Where(x => x.id == team.id).FirstOrDefault() == null)
				return NotFound();

			for (int i = team.players.Count; i > 0; i--)
			{
				player player = team.players.Last();
				if (player.rating != null)
					db.ratings.Remove(player.rating);
				db.players.Remove(player);
				db.SaveChanges();
			}

			db.teams.Remove(team);
			db.SaveChanges();

			return Ok(team);
		}

		[Authorize(Roles = "admin,manager")]
		[Route("api/continents/{id}/teams/{tid}")]
		[ResponseType(typeof(void))]
		public IHttpActionResult Putteam(int id, int tid, team team)
		{

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (tid != team.id)
			{
				return BadRequest();
			}

			//continent continent = db.continents.Find(id);

			//
			// for moq
			//
			continent continent = db.continents.Where(l => l.id == id).FirstOrDefault();

			if (continent == null)
			{
				return NotFound();
			}

			//
			// for moq
			//
			if (continent.teams.Where(x => x.id == team.id).FirstOrDefault() == null)
				return NotFound();

			db.Entry(team).State = EntityState.Modified;

			db.SaveChanges();

			return StatusCode(HttpStatusCode.NoContent);
		}
		#endregion

		#region Player api
		[ResponseType(typeof(player))]
		[Route("api/continents/{id}/teams/{tid}/players")]
		public IHttpActionResult Getplayers(int id, int tid)
		{
			//continent continent = db.continents.Find(id);

			//
			// for moq
			//
			continent continent = db.continents.Where(l => l.id == id).FirstOrDefault();

			if (continent == null)
			{
				return NotFound();
			}

			//team team = db.teams.Find(id);

			//
			// for moq
			//
			team team = db.teams.Where(l => l.id == tid).FirstOrDefault();

			if (team == null)
			{
				return NotFound();
			}

			/*if (!continent.teams.Contains(team))
			{
				return NotFound();
			}*/

			if (continent.teams.Where(x => x.id == team.id).FirstOrDefault() == null)
				return NotFound();

			return Ok(team.players.ToList());
		}

		[Route("api/continents/{id}/teams/{tid}/players/{pid}")]
		[ResponseType(typeof(player))]
		public IHttpActionResult Getplayer(int id, int tid, int pid)
		{
			//continent continent = db.continents.Find(id);

			//
			// for moq
			//
			continent continent = db.continents.Where(l => l.id == id).FirstOrDefault();

			if (continent == null)
			{
				return NotFound();
			}

			//team team = db.teams.Find(id);

			//
			// for moq
			//
			team team = db.teams.Where(l => l.id == tid).FirstOrDefault();

			if (team == null)
			{
				return NotFound();
			}

			/*if (!continent.teams.Contains(team))
			{
				return NotFound();
			}*/

			if (continent.teams.Where(x => x.id == team.id).FirstOrDefault() == null)
				return NotFound();

			//player player= db.players.Find(pid);

			//
			// for moq
			//
			player player = db.players.Where(l => l.id == pid).FirstOrDefault();

			if (player == null)
			{
				return NotFound();
			}

			/*if (!team.players.Contains(player))
			{
				return NotFound();
			}*/

			if (team.players.Where(x => x.id == player.id).FirstOrDefault() == null)
				return NotFound();

			return Ok(player);
		}

		[Authorize(Roles = "admin,manager")]
		[Route("api/continents/{id}/teams/{tid}/players")]
		[ResponseType(typeof(player))]
		public IHttpActionResult Postplayer(int id, int tid, player player)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			//continent continent = db.continents.Find(id);
			//
			// for moq
			//
			continent continent = db.continents.Where(l => l.id == id).FirstOrDefault();

			if (continent == null)
			{
				return NotFound();
			}

			//team team= db.teams.Find(id);

			//
			// for moq
			//
			team team = db.teams.Where(l => l.id == tid).FirstOrDefault();

			if (team == null)
			{
				return NotFound();
			}

			/*if (!continent.teams.Contains(team))
			{
				return NotFound();
			}*/

			if (continent.teams.Where(x => x.id == team.id).FirstOrDefault() == null)
				return NotFound();


			db.players.Add(player);
			db.SaveChanges();

			return Ok(player);
		}

		[Authorize(Roles = "admin,manager")]
		[Route("api/continents/{id}/teams/{tid}/players/{pid}")]
		[ResponseType(typeof(player))]
		public IHttpActionResult Deleteplayer(int id, int tid, int pid)
		{
			//continent continent = db.continents.Find(id);

			//
			// for moq
			//
			continent continent = db.continents.Where(l => l.id == id).FirstOrDefault();

			if (continent == null)
			{
				return NotFound();
			}

			//team team = db.teams.Find(id);
			//
			// for moq
			//
			team team = db.teams.Where(l => l.id == tid).FirstOrDefault();

			if (team == null)
			{
				return NotFound();
			}

			/*if (!continent.teams.Contains(team))
			{
				return NotFound();
			}*/

			if (continent.teams.Where(x => x.id == team.id).FirstOrDefault() == null)
				return NotFound();

			//player player= db.players.Find(pid);

			//
			// for moq
			//
			player player = db.players.Where(l => l.id == pid).FirstOrDefault();

			if (player == null)
			{
				return NotFound();
			}

			/*if (!team.players.Contains(player))
			{
				return NotFound();
			}*/

			if (team.players.Where(x => x.id == player.id).FirstOrDefault() == null)
				return NotFound();

			db.players.Remove(player);
			db.SaveChanges();

			return Ok(player);
		}

		[Authorize(Roles = "admin,manager")]
		[Route("api/continents/{id}/teams/{tid}/players/{pid}")]
		[ResponseType(typeof(void))]
		public IHttpActionResult Putplayer(int id, int tid, int pid, player pl)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			//continent continent = db.continents.Find(id);

			//
			// for moq
			//
			continent continent = db.continents.Where(l => l.id == id).FirstOrDefault();

			if (continent == null)
			{
				return NotFound();
			}

			//team team = db.teams.Find(id);
			//
			// for moq
			//
			team team = db.teams.Where(l => l.id == tid).FirstOrDefault();

			if (team == null)
			{
				return NotFound();
			}

			/*if (!continent.teams.Contains(team))
			{
				return NotFound();
			}*/

			if (continent.teams.Where(x => x.id == team.id).FirstOrDefault() == null)
				return NotFound();

			//player player= db.players.Find(pid);

			//
			// for moq
			//
			player player = db.players.Where(l => l.id == pid).FirstOrDefault();

			if (player == null)
			{
				return NotFound();
			}

			/*if (!team.players.Contains(player))
			{
				return NotFound();
			}*/

			if (team.players.Where(x => x.id == player.id).FirstOrDefault() == null)
				return NotFound();

			if (pid != pl.id)
			{
				return BadRequest();
			}

			db.Entry(pl).State = EntityState.Modified;

			db.SaveChanges();


			return StatusCode(HttpStatusCode.NoContent);
		}
		#endregion

		protected override void Dispose(bool disposing)
		{
			if (disposing)
			{
				db.Dispose();
			}

			base.Dispose(disposing);
		}

		private bool continentExists(int id)
		{
			return db.continents.Count(e => e.id == id) > 0;
		}
	}
}
