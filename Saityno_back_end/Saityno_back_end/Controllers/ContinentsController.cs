﻿using System;
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

		// GET: api/Continents
		public IEnumerable<continent> Getcontinents()
		{
			return db.continents.ToList(); ;
		}

		// GET: api/Continents/5
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

        // PUT: api/Continents/5
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

        // POST: api/Continents
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

        // DELETE: api/Continents/5
        [ResponseType(typeof(continent))]
        public IHttpActionResult Deletecontinent(int id)
        {
            continent continent = db.continents.Find(id);
            if (continent == null)
            {
                return NotFound();
            }

            db.continents.Remove(continent);
            db.SaveChanges();

            return Ok(continent);
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
    }
}