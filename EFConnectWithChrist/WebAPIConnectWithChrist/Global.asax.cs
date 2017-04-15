using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Web.Mvc;
using WebAPIConnectWithChrist.App_Start;

namespace WebAPIConnectWithChrist
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            var rhm = new RequestHeaderMapping("Accept", "text/html",
                StringComparison.InvariantCultureIgnoreCase, true, "application/json");
            AutoMapperConfig.Configure();
            WebApiConfig.RegisterRoutes(RouteTable.Routes);
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.MediaTypeMappings.Add(rhm);
        }
    }
}
