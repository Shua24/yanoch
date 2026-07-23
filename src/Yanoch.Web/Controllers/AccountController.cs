using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Yanoch.Web.Controllers;

[ApiController]
[Route("account")]
[IgnoreAntiforgeryToken]
public class AccountController : ControllerBase
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;

    public AccountController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromForm] string email, [FromForm] string password)
    {
        var user = new IdentityUser { UserName = email, Email = email };
        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            return Redirect("/register?error=" + Uri.EscapeDataString(string.Join("; ", result.Errors.Select(e => e.Description))));

        await _signInManager.SignInAsync(user, isPersistent: false);
        return Redirect("/");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromForm] string email, [FromForm] string password, [FromForm] bool rememberMe = false)
    {
        var result = await _signInManager.PasswordSignInAsync(email, password, rememberMe, lockoutOnFailure: false);
        if (!result.Succeeded)
            return Redirect("/login?error=" + Uri.EscapeDataString("Invalid email or password."));

        return Redirect("/");
    }

    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Redirect("/");
    }
}
