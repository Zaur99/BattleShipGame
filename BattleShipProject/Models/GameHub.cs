using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BattleShipProject.Models
{
    public class GameHub : Hub
    {
        public List<Battle> _battleList;

        public GameHub()
        {
            _battleList = GameLogic.BattleList;
        }
        public override Task OnConnectedAsync()
        {
            var socketId = Context.ConnectionId;
            GameLogic.AddSocketToEmptyBattle(socketId, _battleList);

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(System.Exception exception)
        {
            var discId = Context.ConnectionId;
            Battle playerBattle = _battleList.FirstOrDefault(g=>g.BattleFields.Any(x=>x.SocketId == discId));
            
            if (GameLogic.RemoveDisconnectedPlayer(playerBattle, _battleList) && playerBattle.BattleFields.Count == 2)
            {
                var oppSocketId = playerBattle.BattleFields.FirstOrDefault(g=>g.SocketId != discId).SocketId;
                string message = JsonConvert.SerializeObject(new { disconnected = true });
                 Clients.Client(oppSocketId).SendAsync("OnDisconnected",message);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task BindSocketAndPlayerData(string playerName, string playerArray)
        {
            var socketId = Context.ConnectionId;
            BattleField battleField = _battleList.SelectMany(i => i.BattleFields).FirstOrDefault(t => t.SocketId == socketId);
            battleField.PlayerName = playerName;
            battleField.BattleFieldArray = JsonConvert.DeserializeObject<string[,]>(playerArray);
            battleField.Ready = true;
            bool senderMessage = true;
            //await SendMessageToSingleSocket(socketId, senderMessage);
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", senderMessage);
        }

        public async Task StartGame()
        {
            var senderSocketId = Context.ConnectionId;
            Battle playerBattle = _battleList.FirstOrDefault(g => g.BattleFields.Any(x => x.SocketId == senderSocketId));

            if (playerBattle.IsGameReady())
            {
                var receiverSocketId = playerBattle.BattleFields.FirstOrDefault(i => i.SocketId != senderSocketId).SocketId;
                string senderMessage = JsonConvert.SerializeObject(new
                {
                    connected = true,
                    turn = playerBattle.IsPlayersTurn(senderSocketId) ? "player" : "opponent",
                    opponentName = playerBattle.BattleFields.FirstOrDefault(x => x.SocketId == receiverSocketId).PlayerName
                });

                string receiverMessage = JsonConvert.SerializeObject(new
                {
                    connected = true,
                    turn = playerBattle.IsPlayersTurn(senderSocketId) ? "opponent" : "player",
                    opponentName = playerBattle.BattleFields.FirstOrDefault(x => x.SocketId == senderSocketId).PlayerName
                });
                await Clients.Client(senderSocketId).SendAsync("GetMessage", senderMessage);
                await Clients.Client(receiverSocketId).SendAsync("GetMessage", receiverMessage);

            }



        }
        public async Task PlayTurn(string x, string y)
        {
            var socketId = Context.ConnectionId;
            Battle battle = _battleList.FirstOrDefault(g => g.BattleFields.Any(bf => bf.SocketId == socketId));
            if (battle.IsPlayersTurn(socketId))
            {
                bool isHit = battle.Shoot(socketId, x, y);
                string senderMessage;
                string receiverMessage;
                var receiverSocketId = battle.BattleFields.FirstOrDefault(i => i.SocketId != socketId).SocketId;

                if (battle.IsGameOver())
                {
                    senderMessage = JsonConvert.SerializeObject(new
                    {

                        won = (battle.GetWinnerName() == socketId) ? false : true

                    });

                    receiverMessage = JsonConvert.SerializeObject(new
                    {

                        won = (battle.GetWinnerName() == socketId) ? true : false

                    });
                }
                else
                {
                    senderMessage = JsonConvert.SerializeObject(new
                    {
                        x,
                        y,
                        hit = isHit,
                        previousTurn = "player",
                        turn = "opponent"


                    });

                    receiverMessage = JsonConvert.SerializeObject(new
                    {
                        x,
                        y,
                        hit = isHit,
                        previousTurn = "opponent",
                        turn = "player"


                    });


                }

                await Clients.Client(socketId).SendAsync("UpdateShoot", senderMessage);
                await Clients.Client(receiverSocketId).SendAsync("UpdateShoot", receiverMessage);

            }

        }
    }
}
