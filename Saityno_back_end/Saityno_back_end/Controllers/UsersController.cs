using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Description;
using Saityno_back_end;

namespace Saityno_back_end.Controllers
{
	public class UsersController : ApiController
	{

		private saitynasEntities2 db = new saitynasEntities2();

		[Authorize]
		[ResponseType(typeof(user))]
		public IHttpActionResult Getuser()
		{
			var identity = (ClaimsIdentity)User.Identity;
			user user = db.users.FirstOrDefault(a=>a.username==identity.Name);
			if (user == null)
			{
				return NotFound();
			}
			user.password = null;
			return Ok(user);
		}

		[Authorize]
		// PUT: api/Users/5
		[ResponseType(typeof(void))]
		public IHttpActionResult Putuser(int id, user user)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (id != user.id)
			{
				return BadRequest();
			}


			db.Entry(user).State = EntityState.Modified;

			if (!userExists(id))
			{
				return NotFound();
			}
			else
			{
				db.SaveChanges();
			}

			return StatusCode(HttpStatusCode.NoContent);
		}

		[Authorize(Roles = "admin,manager")]
		[ResponseType(typeof(user))]
		public IHttpActionResult Deleteuser(int id)
		{
			user user = db.users.Find(id);

			if (user == null)
			{
				return NotFound();
			}


			db.users.Remove(user);
			db.SaveChanges();

			user.password = null;

			return Ok(user);
		}

		// POST: api/Users
		[ResponseType(typeof(user))]
		public IHttpActionResult Postuser(user user)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			db.users.Add(user);
			db.SaveChanges();

			user.password = null;

			return Ok(user);
		}

		private bool userExists(int id)
		{
			return db.users.Count(e => e.id == id) > 0;
		}
	}
}