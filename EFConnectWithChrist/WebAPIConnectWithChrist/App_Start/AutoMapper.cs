using AutoMapper;
using EF = EFConnectWithChrist;

namespace WebAPIConnectWithChrist.App_Start
{
    public static class AutoMapperConfig
    {
        public static void Configure()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<EF.User, Models.User>();
                cfg.CreateMap<EF.UserType, Models.UserType>();
                cfg.CreateMap<EF.Passion, Models.Passion>();

                cfg.CreateMap<Models.User, EF.User>();
                cfg.CreateMap<Models.UserType, EF.UserType>();
                cfg.CreateMap<Models.Passion, EF.Passion>();
            });
        }
    }
}