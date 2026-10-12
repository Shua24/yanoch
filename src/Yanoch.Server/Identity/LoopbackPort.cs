using System.Net;
using System.Net.Sockets;

namespace Yanoch.Server.Identity;

/// <summary>
/// Reserves a free loopback TCP port for the desktop host's in-process server.
/// </summary>
/// <remarks>
/// The listener is bound to port 0 so the operating system picks a free port, and it is released
/// immediately: Kestrel then binds the same port. The alternative — a fixed port — would let any
/// other process on the machine squat it, and would also collide when two Yanoch windows run.
/// </remarks>
public static class LoopbackPort
{
    /// <summary>Returns a currently free TCP port on the loopback interface.</summary>
    public static int Reserve()
    {
        TcpListener reservationListener = new TcpListener(IPAddress.Loopback, 0);
        reservationListener.Start();
        int reservedPort = ((IPEndPoint)reservationListener.LocalEndpoint).Port;
        reservationListener.Stop();
        return reservedPort;
    }
}
