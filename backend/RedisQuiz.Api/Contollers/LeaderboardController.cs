using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace RedisQuiz.Api.Controllers;

[ApiController]
[Route("api/leaderboard")]
public class LeaderboardController : ControllerBase
{
    private readonly IConnectionMultiplexer redis;

    public LeaderboardController(IConnectionMultiplexer redis)
    {
        this.redis = redis;
    }

    [HttpGet("overall")]
    public async Task<IActionResult> GetOverall()
    {
        var database = redis.GetDatabase();

        var entries = await database.SortedSetRangeByRankWithScoresAsync(
            "leaderboard:all",
            start: 0,
            stop: -1,
            order: Order.Descending);

        var leaderboard = entries.Select((entry, index) => new
        {
            rank = index + 1,
            player = entry.Element.ToString(),
            points = entry.Score
        }).ToArray();

        return Ok(leaderboard);
    }
}