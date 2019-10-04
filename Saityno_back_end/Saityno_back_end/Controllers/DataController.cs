using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;

namespace Saityno_back_end.Controllers
{
    public class DataController : ApiController
    {

		[AllowAnonymous]
		[HttpGet]
		[Route("api/data/forall")]
		public IHttpActionResult Get()
		{
			return Ok("Now server time is: " + DateTime.Now.ToString());
		}

		[Authorize]
		[HttpGet]
		[Route("api/data/authenticate")]
		public IHttpActionResult GetForAuthenticate()
		{
			var identity = (ClaimsIdentity)User.Identity;
			return Ok("Hello " + identity.Name);
		}

		[Authorize(Roles = "admin")]
		[HttpGet]
		[Route("api/data/authorize")]
		public IHttpActionResult GetForAdmin()
		{
			var identity = (ClaimsIdentity)User.Identity;
			var roles = identity.Claims
						.Where(c => c.Type == ClaimTypes.Role)
						.Select(c => c.Value);
			return Ok("Hello " + identity.Name + " Role: " + string.Join(",", roles.ToList()));

		}
		[Authorize(Roles = "manager")]
		[HttpGet]
		[Route("api/data/authorize1")]
		public IHttpActionResult GetForManager()
		{
			var identity = (ClaimsIdentity)User.Identity;
			var roles = identity.Claims
						.Where(c => c.Type == ClaimTypes.Role)
						.Select(c => c.Value);
			return Ok("Hello " + identity.Name + " Role: " + string.Join(",", roles.ToList()));

		}
		[Authorize(Roles = "user")]
		[HttpGet]
		[Route("api/data/authorize2")]
		public IHttpActionResult GetForUser()
		{
			var identity = (ClaimsIdentity)User.Identity;
			var roles = identity.Claims
						.Where(c => c.Type == ClaimTypes.Role)
						.Select(c => c.Value);
			return Ok("Hello " + identity.Name + " Role: " + string.Join(",", roles.ToList()));

		}
	}
}
