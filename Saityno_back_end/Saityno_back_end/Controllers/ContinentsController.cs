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
	public class ContinentsController : ApiController
	{
		private saitynasEntities2 db = new saitynasEntities2();

		public IEnumerable<continent> Getcontinents()
		{
			return db.continents.ToList();
		}

		[ResponseType(typeof(continent))]
		public IHttpActionResult Getcontinent(int id)
		{
			continent continent = db.continents.Find(id);
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

			try
			{
				db.SaveChanges();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!continentExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
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

			return CreatedAtRoute("DefaultApi", new { id = continent.id }, continent);
		}

		[Authorize(Roles = "admin")]
		[ResponseType(typeof(continent))]
		public IHttpActionResult Deletecontinent(int id)
		{
			continent continent = db.continents.Find(id);
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
		//------------------------------------------------- Teams api
		[ResponseType(typeof(team))]
		[Route("api/continents/{id}/teams")]
		public IHttpActionResult Getteams(int id)
		{
			continent continent = db.continents.Find(id);
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
			continent continent = db.continents.Find(id);
			if (continent == null)
			{
				return NotFound();
			}
			team team = db.teams.Find(tid);
			if (team == null)
			{
				return NotFound();
			}
			if (!continent.teams.Contains(team))
			{
				return NotFound();
			}

			return Ok(team);
		}

		[Authorize(Roles = "admin,manager")]
		[Route("api/continents/{id}/teams")]
		[ResponseType(typeof(team))]
		public IHttpActionResult Postteam(int id, team team)
		{
			continent continent = db.continents.Find(id);
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
			continent continent = db.continents.Find(id);
			if (continent == null)
			{
				return NotFound();
			}
			team team = db.teams.Find(tid);
			if (team == null)
			{
				return NotFound();
			}

			if (!continent.teams.Contains(team))
			{
				return NotFound();
			}
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

			continent continent = db.continents.Find(id);
			if (continent == null)
			{
				return NotFound();
			}

			db.Entry(team).State = EntityState.Modified;

			try
			{
				db.SaveChanges();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!teamExists(tid))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return StatusCode(HttpStatusCode.NoContent);
		}
		//--------------------------------------- Player api

		[ResponseType(typeof(player))]
		[Route("api/continents/{id}/teams/{tid}/players")]
		public IHttpActionResult Getplayers(int id, int tid)
		{
			continent continent = db.continents.Find(id);
			if (continent == null)
			{
				return NotFound();
			}
			team team = db.teams.Find(tid);
			if (team == null)
			{
				return NotFound();
			}
			if (!continent.teams.Contains(team))
			{
				return NotFound();
			}
			return Ok(team.players.ToList());
		}

		[Route("api/continents/{id}/teams/{tid}/players/{pid}")]
		[ResponseType(typeof(player))]
		public IHttpActionResult Getplayer(int id, int tid, int pid)
		{
			continent continent = db.continents.Find(id);
			if (continent == null)
			{
				return NotFound();
			}
			team team = db.teams.Find(tid);
			if (team == null)
			{
				return NotFound();
			}
			if (!continent.teams.Contains(team))
			{
				return NotFound();
			}
			player player = db.players.Find(pid);
			if (player == null)
			{
				return NotFound();
			}
			if (!team.players.Contains(player))
			{
				return NotFound();
			}
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

			continent continent = db.continents.Find(id);
			if (continent == null)
			{
				return NotFound();
			}
			team team = db.teams.Find(tid);
			if (team == null)
			{
				return NotFound();
			}
			if (!continent.teams.Contains(team))
			{
				return NotFound();
			}

			db.players.Add(player);
			db.SaveChanges();

			return Ok(player);
		}

		[Authorize(Roles = "admin,manager")]
		[Route("api/continents/{id}/teams/{tid}/players/{pid}")]
		[ResponseType(typeof(player))]
		public IHttpActionResult Deleteplayer(int id, int tid, int pid)
		{
			continent continent = db.continents.Find(id);
			if (continent == null)
			{
				return NotFound();
			}
			team team = db.teams.Find(tid);
			if (team == null)
			{
				return NotFound();
			}
			if (!continent.teams.Contains(team))
			{
				return NotFound();
			}
			player player = db.players.Find(pid);
			if (player == null)
			{
				return NotFound();
			}
			if (!team.players.Contains(player))
			{
				return NotFound();
			}

			db.players.Remove(player);
			db.SaveChanges();

			return Ok(player);
		}

		[Authorize(Roles = "admin,manager")]
		[Route("api/continents/{id}/teams/{tid}/players/{pid}")]
		[ResponseType(typeof(void))]
		public IHttpActionResult Putplayer(int id, int tid, int pid, player player)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (pid != player.id)
			{
				return BadRequest();
			}

			db.Entry(player).State = EntityState.Modified;

			try
			{
				db.SaveChanges();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!playertExists(pid))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return StatusCode(HttpStatusCode.NoContent);
		}


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
		private bool teamExists(int id)
		{
			return db.teams.Count(e => e.id == id) > 0;
		}
		private bool playertExists(int id)
		{
			return db.players.Count(e => e.id == id) > 0;
		}
	}
}