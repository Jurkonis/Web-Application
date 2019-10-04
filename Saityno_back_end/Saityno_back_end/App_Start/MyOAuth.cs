using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace Saityno_back_end
{
	public class MyOAuth : OAuthAuthorizationServerProvider
	{
		private saitynasEntities2 db = new saitynasEntities2();

		public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
		{
			context.Validated(); // 
		}

		public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
		{
			var identity = new ClaimsIdentity(context.Options.AuthenticationType);
			user user = db.users.FirstOrDefault(a => a.username == context.UserName && a.password == context.Password);
			if (user == null)
			{
				context.SetError("invalid_grant", "Provided username and password is incorrect");
				return;
			}
			else
			{
				if (user.userlevel == 3)
				{
					identity.AddClaim(new Claim(ClaimTypes.Role, "admin"));
				}
				else if (user.userlevel == 2)
				{
					identity.AddClaim(new Claim(ClaimTypes.Role, "manager"));
				}
				else if (user.userlevel == 1)
				{
					identity.AddClaim(new Claim(ClaimTypes.Role, "user"));
				}
				identity.AddClaim(new Claim(ClaimTypes.Name, user.username));
				context.Validated(identity);
			}

		}
	}
}
