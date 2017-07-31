module.exports = function crTest(dispatch) {
	
	let CID = null;
	let boss = undefined;
	let boss2 = undefined;
	let teleLocation = null;
	
	const bossId = [[472, 22], [472, 23], [472, 19], [472, 5000], [472, 101]];
	const coordinates = [[62996, 70055, -1664], [68867.84375, 63640.26171875, -1673.3280029296875], [66058.0703125, 68606.640625, -1660.52373339843745], [72455.4375, 70989.90625, -1676.3280029296875], [74152.6015625, 71797.125, -1675.328002929675]]
	
	var bossDead = [false, false, false, false];
	
	dispatch.hook('S_LOGIN', 1, event => {
		CID = event.cid;
	})
	
	dispatch.hook('cChat', 1 , (event) => {
		if(event.message.includes('!gl')){
			dispatch.hookOnce('S_SPAWN_ME', 1, event => {
				if(coordinates[0][0] == event.x && coordinates[0][1] == event.y && coordinates[0][2] == event.z)
				{
					spawnTele();
					return false;
				}
				//console.log(event.x + ' ' + event.y + ' ' + event.z + ' ' + event.w);
				//console.log(coordinates[0][0] + ' ' + coordinates[0][1] + ' ' + coordinates[0][2]);
			})
			return false;
		}
	});
	
	dispatch.hook('S_BOSS_GAGE_INFO', 2, (event) => {
		if (event.huntingZoneId === bossId[0][0] && event.templateId === bossId[0][1]) {
			boss = event;
		}
		
		else if (event.huntingZoneId === bossId[1][0] && event.templateId === bossId[1][1]){
			boss = event;
		}

		else if (event.huntingZoneId === bossId[3][0] && event.templateId === bossId[3][1]){
			boss = event;
		}
		else if (event.huntingZoneId === bossId[4][0] && event.templateId === bossId[4][1]){
			boss = event;
		}

		if (boss) {
			let bossHp = bossHealth();
			if (bossHp <= 0 && bossDead[0] == false && boss.huntingZoneId === bossId[0][0] && boss.templateId === bossId[0][1]) {
				boss = undefined;
				bossDead[0] = true;
				bossTele(coordinates[2]);
			}
			
			else if (bossHp <= 0 && bossDead[0] == true && boss.huntingZoneId === bossId[1][0] && boss.templateId === bossId[1][1]) {
				boss = undefined;
				bossDead[1] = true;
				bossTele(coordinates[3]);
			}
			
			else if (bossHp <= 0 && bossDead[1] == true && boss.huntingZoneId === bossId[3][0] && boss.templateId === bossId[3][1]) {
				boss = undefined;
				bossDead[2] = true;
				bossTele(coordinates[4]);
			}
			else if (bossHp <= 0 && bossDead[2] == true && boss.huntingZoneId === bossId[4][0] && boss.templateId === bossId[4][1]) {
				boss = undefined;
				bossDead[0] = false;
				bossDead[1] = false;
				bossDead[2] = false;
			}
			
		}
	 })
	 
	 	
	function bossHealth() {
		return (boss.curHp / boss.maxHp);
	}
	
	function spawnTele()
	{
		dispatch.toClient('S_SPAWN_ME', 1, {
			target: CID,
			x: coordinates[1][0],
			y: coordinates[1][1],
			z: coordinates[1][2],
			alive: 1,
			unk: 0
		})
	}
	
		function bossTele(coordinates)
	{
		teleLocation = {
			x: coordinates[0],
			y: coordinates[1],
			z: coordinates[2]
		};
		dispatch.toClient('S_INSTANT_MOVE', 1, Object.assign(teleLocation, { id: CID}))
	}
}

