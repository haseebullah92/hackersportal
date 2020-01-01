using SimpleInjector;

namespace HackersPortal.DependencyResolver
{
    public static class Ioc
    {
        public static Container Container { get; set; }

        static Ioc()
        {
            Container = new Container();
        }
    }
}