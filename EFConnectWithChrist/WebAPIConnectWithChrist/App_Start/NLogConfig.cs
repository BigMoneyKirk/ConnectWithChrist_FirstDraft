using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPIConnectWithChrist.App_Start
{
    public class NLogConfig
    {
        public static Logger logger = LogManager.GetCurrentClassLogger();
    }
}