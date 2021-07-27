// -> Hud
Scene_Map.prototype.start							= function() {
    _aliasGFS._scenMap_star.call(this);
	this.GFS_createHUD();
	this.GFS_createUpperHUD();
};
Scene_Map.prototype.GFS_createHUD					= function(id) {
	this._Hud1 = new GFS_Hud();
	this._Hud1.opacity = 0;
	this.addChild(this._Hud1);
};
Scene_Map.prototype.GFS_createUpperHUD					= function(id) {
	this._Hud2 = new GFS_UpperHud();
	this._Hud2.opacity = 0;
	this.addChild(this._Hud2);
};
Scene_Map.prototype.GFS_isInputReady				= function() {
	if($gamePlayer.GFS_isReload)
		return false;
	if(this.GFS_inputWait > 0){
		this.GFS_inputWait--;
		return false
	};
	return true;
}
Scene_Map.prototype.GFS_updateHud					= function(){
	if(this.GFS_waitHud == 600 && $gameSystem.GFS_getHudForcedContent() != 0 && $gameSystem.GFS_isRetractableHud){
		$gameSystem.GFS_setHudForcedValue(0);
		this.GFS_waitHud = 0;
	}else
		this.GFS_waitHud++;
};



//WINDOWS BASE
Window_Base.prototype.GFS_drawLayer					= function() {
	var _name = "layer_";
	var bitmap = ImageManager.GFS_loadHud(_name + this.GFS_content);
	this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, this.getInHudPosX(), this.getInHudPosY());
};
Window_Base.prototype.refreshHudMask				= function() {
	var _name = "layout";
	var bitmap = ImageManager.GFS_loadHud(_name);
	this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, 0, 0);
};
// -> Draw Weapons
Window_Base.prototype.GFS_drawWeapon2				= function(arme, x , y) {
	var _arme = arme - 1;
	var width = 64;
	var height = 32;
	var nbrLine = 6;
	var bitmap = ImageManager.GFS_loadHud('arme');
	var pw = width;
	var ph = height;
	var sx = _arme % nbrLine * pw; // position x sur le factionset
	var sy = Math.floor(_arme / nbrLine) * ph; // position y sur le factionset
	this.contents.blt(bitmap, sx, sy, pw/2, ph, x, y);
};
Window_Base.prototype.GFS_drawWeapon				= function(arme, x , y) {
	var _arme = arme - 1;
	var width = 64;
	var height = 32;
	var nbrLine = 6;
	var bitmap = ImageManager.GFS_loadHud('arme');
	var pw = width;
	var ph = height;
	var sx = _arme % nbrLine * pw; // position x sur le factionset
	var sy = Math.floor(_arme / nbrLine) * ph; // position y sur le factionset
	this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};
//-> Basic getter
Window_Base.prototype.hudBasePadding				= function(){
	return 12;
}
Window_Base.prototype.hudTotalWidth					= function() {
	return this.GFS_totalWidth;
};
Window_Base.prototype.hudUsableWidth				= function(){
	return this.hudTotalWidth() - this.hudBasePadding() * 2;
};
Window_Base.prototype.hudLifeFillPadding			= function(x, y) {
	return  0;
}
Window_Base.prototype.hudContentPaddingY			= function(){
	return 48;
}
// -> draw life + stamina
Window_Base.prototype.GFS_drawLife					= function() {
	var _w = this.hudUsableWidth();
	var _x = this.hudBasePadding() + this.hudLifeFillPadding();
	var _y = this.hudBasePadding() + this.getInHudPosX() + this.getInHudPosY();
	if($gamePlayer.GFS_getPlayerArmorValue() > 0)
		this.GFS_drawGiletFill(_x, _y , _w);
    this.GFS_drawLifeFill(_x, _y,  _w);
	this.GFS_drawStaminaFill(_x, _y, _w);
	
}
Window_Base.prototype.GFS_drawLifeFill				= function(x, y, width) {
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, $gameParty.leader().hpRate(), color1, color2);
};
Window_Base.prototype.GFS_drawStaminaFill			= function(x, y, width) {
	var _width = $gameParty.leader().hpRate() * width;
	var rate = $gameParty.leader().mpRate();
	var _y = this.lineHeight() - 32 + y;
	var fillW = Math.floor(_width * rate);
	var _x = _width - fillW + 6 + x;
	
    var color1 = this.tpGaugeColor2();
    var color2 = this.tpGaugeColor1();
	this.contents.gradientFillRect(_x, _y, fillW, 6, color1, color2);
};
Window_Base.prototype.GFS_drawGiletFill				= function(x, y, width) {
	var _giletValue = $gamePlayer.GFS_getPlayerArmorValue();
	var _x = 6  + x - _giletValue;
	var _width = width + _giletValue * 2;
	var height = 6 + _giletValue * 2;
	var _y = this.lineHeight() - 32 - _giletValue + y;
	this.contents.fillRect(_x, _y, _width, height, this.textColor(9));
};
// -> Draw munit
Window_Base.prototype.GFS_drawMunits				= function(armeId, x, y) {
	
	var _arme = $dataArm[armeId];
	var m = $gameParty.numItems($dataItems[_arme.munit])
	//--------------------------
	//Chambre
	if(m > 0) {
		var _hudWidth = 68;
		var _munitMax = _arme.loadCap;
		var bitmap = ImageManager.GFS_loadHud('mu' + armeId);
		var _munitWidth = bitmap._canvas.width + 4;
		var _munitHeight = bitmap._canvas.height;
		var _padding = [];
		
		
		var _munitByLine = this.GFS_getMunitByLine(_hudWidth, _arme, _munitWidth);
		//_aliasGFS.log("munition/line: " + _munitByLine);
		
		_padding[1] = this.GFS_getMunitPadding(_hudWidth, _munitByLine, _munitWidth);
		_padding[0] = this.GFS_getMunitFirstSpace(_hudWidth, _munitByLine, _munitWidth);
		//_aliasGFS.log("FirstSpace:" + _padding[0] + " / padding:" + _padding[1]);
		var _lign = 0; 
		for(i=0; i < m; i++){
			if(i >= _munitByLine){
				_lign = 1;
			};
			var _xMunit = ( i * (_munitWidth + _padding[1]) ) - (_lign * _hudWidth) + x + _padding[0] + (_lign * _padding[0] * 2) + _arme.padd;
			var _yMunit = (_lign * (_munitHeight + 4)) + y;
			//_aliasGFS.log("x:" + _xMunit + " / y:" + _yMunit);
			this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, _xMunit, _yMunit);
		}
	} else {
		var bitmap = ImageManager.GFS_loadHud('reload');
		this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, x, y-5);		
	};
};
Window_Base.prototype.GFS_drawPack					= function(armeId, x, y) {
	var pk = $gameParty.numItems($dataItems[$dataArm[armeId].munitPack])
	if(pk>0) {
		var bitmap = ImageManager.GFS_loadHud('pa'+armeId);
		var _pkWidth = bitmap._canvas.width + 4;
		var _pkHeight = bitmap._canvas.height;
		var _hudWidth = 68;
		var _maxVisible = Math.floor(_hudWidth / _pkWidth);
		var _padding = Math.floor((_hudWidth  - _maxVisible * _pkWidth) / 2); 
		
		for(i=0; i < _maxVisible; i++){
			if(i < pk && pk <= _maxVisible){
				var _xPk = ( i * _pkWidth) + _padding + x;
				var _yPk = 4 + y;
				this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, _xPk, _yPk);
			};
		}
		
		if(pk > _maxVisible){
			var _yPk = y;
			var _xPk = x + Math.floor((_hudWidth / 2) - 4);
			this.contents.blt(bitmap, 0, 0,  bitmap._canvas.width, bitmap._canvas.height, _xPk, _yPk);
			this.drawText("+" + pk, _xPk + 5, _yPk, bitmap._canvas.width, 20, 'center');
		};
	}else{
		this.contents.textColor = this.textColor(2);
		this.drawText("0 munition", x + 4, y + 4, _hudWidth, 20, 'center');
	};
};
Window_Base.prototype.GFS_getNumLineMunit			= function(lineWidth, arme, munitWidth) {
	if(arme.loadCap * munitWidth > lineWidth)
		return 2;
	return 1;
}
Window_Base.prototype.GFS_getMunitByLine			= function(width, arme, munitWidth) {
	if(this.GFS_getNumLineMunit(width, arme, munitWidth)  > 1)
	return Math.floor(arme.loadCap / 2);
	else
		return arme.loadCap;
}
Window_Base.prototype.GFS_getMunitLineWidth			= function(munitWidth, munitNum) {
	return munitWidth * munitNum;
}
Window_Base.prototype.GFS_getMunitPadding			= function(lineWidth, munitNum, munitWidth) {
	if($dataArm[$gameParty.leader().equips()[0].id].loadCap == 1)
		return 0;
	
	var _blankSpace = lineWidth - this.GFS_getMunitLineWidth( munitWidth, munitNum);
	var _interSpace;
	if(munitNum > 1)
		_interSpace = Math.floor(_blankSpace / munitNum);
	else
		_interSpace = 0;
	return _interSpace;
}
Window_Base.prototype.GFS_getMunitFirstSpace		= function(lineWidth, munitNum, munitWidth) {
	_interSpace = this.GFS_getMunitPadding(lineWidth, munitNum, munitWidth);
	if($dataArm[$gameParty.leader().equips()[0].id].munitCap == 1)
		return lineWidth / 2 - munitWidth / 2;
	
	var _blankSpace = lineWidth - this.GFS_getMunitLineWidth( munitWidth, munitNum);
	var _blankRest = Math.floor(_blankSpace - _interSpace * munitNum);
	return _blankRest / 2;
}
//-> Draw stats tab
Window_Base.prototype.GFS_drawStatsTab				= function(x, y) {
	var _stats = [
		null,
		$gamePlayer.GFS_getPlayerFor(),
		$gamePlayer.GFS_getPlayerDef(),
		$gamePlayer.GFS_getPlayerAgility(),
		$gamePlayer.GFS_getPlayerPrecision()
	];
	
	for(i = 1; i< _stats.length; i++){
		var _name = $dataSkills[i].name;
		var _iconId = $dataSkills[i].iconIndex;
		var _value = _stats[i];
		var _y = y + i * 32 - 4;
		this.GFS_drawStat(_name, _iconId, _value, x, _y);
	}
};
Window_Base.prototype.GFS_drawStat					= function(name, iconId, value, x, y){
	this.drawIcon(iconId, x, y);
	this.contents.textColor = this.textColor(0);
	this.contents.fontSize = 20;
	this.drawText(" " + name.substr(0,3).toUpperCase() + ": " + value, x + 36, y, 60, 32, 'left');
};
//-> inventory
Window_Base.prototype.GFS_drawItemsGrid				= function (x, y, numCase, caseWidth, itemsList){
	
	var _line = 0;
	var _case = 0;
	var _caseAll = 0;
	for(i = 0; i < itemsList.length; i++){
		if(itemsList[i].itypeId < 3){
			var _item = itemsList[i];
			if(_case >= caseWidth){
				_case = 0;
				_line++;
			}
			var _x = 32 * _case + x;
			var _y = 32 * _line + y;
			
			var _num = $gameParty.itemContainer(_item)[_item.id];
			
			if(i < numCase)
				this.drawIcon(this.GFS_getPackBlankIconId(), _x, _y);
			else
				this.drawIcon(this.GFS_getPackOverIconId(), _x, _y);
				
			this.drawIcon(_item.iconIndex, _x, _y);
			this.drawText(_num,_x + 18,	_y + 8,12,	20,'center');
			
			_case++;
			_caseAll++;
			
		}
	}
	while(_caseAll < numCase){
		
		if(_case >= caseWidth){
			_case = 0;
			_line++;
		}
		var _x = 32 * _case + x;
		var _y = 32 * _line + y;
		
		this.drawIcon(this.GFS_getPackBlankIconId(), _x, _y);
		_case++;
		_caseAll++;
	}
	return _line;
};
Window_Base.prototype.GFS_getPackBlankIconId		= function() {
	return 208;
};
Window_Base.prototype.GFS_getPackOverIconId			= function() {
	return 209;
};
//-> Minimap getter
Window_Base.prototype.getMinimapX					= function() {
	return $gamePlayer._x - Math.floor(this.getMinimapWidth() / 2);
};
Window_Base.prototype.getMinimapY					= function() {
	return $gamePlayer._y - Math.floor(this.getMinimapHeight() / 2);
};
Window_Base.prototype.getMinimapWidth				= function() {
	return Math.floor(this.hudUsableWidth() / this.getMinimapCaseWidth());
};
Window_Base.prototype.getMinimapHeight				= function() {
	return Math.floor(150 / this.getMinimapCaseWidth());
};
Window_Base.prototype.getMinimapCaseWidth			= function() {

		return this.minimapZoom + 1;
};
Window_Base.prototype.getMinimapPadding				= function() {
	var _usableW = this.hudUsableWidth();
	var _usedW = this.getMinimapCaseWidth() * this.getMinimapWidth();
	var _padding = Math.round((_usableW - _usedW)/2);
	return _padding + this.hudBasePadding();
};
Window_Base.prototype.isInMinimap 					= function() {
	return
		x > this.getMinimapX()
		&& x < this.getMinimapX() + this.getMinimapWidth()
		&& y > this.getMinimapY()
		&& y < this.getMinimapY() + this.getMinimapHeight();
};
Window_Base.prototype.minimapIsPlayerPos			= function(x,y) {
	return x == Math.floor(this.getMinimapWidth()/2) + this.getMinimapX()
	&& y == Math.floor(this.getMinimapHeight()/2)  + this.getMinimapY(); 
};
Window_Base.prototype.GFS_getRegionColors			= function(n) {
	return this.hudMapColor(n);
};
Window_Base.prototype.hudMapColor					= function(n) {
    var px = (n % 8) * 12 + 6;
    var py = Math.floor(n / 8) * 12 + 6;
    return this.hudColorBitmap.getPixel(px, py);
};
//-> Minimap refresh
Window_Base.prototype.loadHudColorBitmap			= function() {
    this.hudColorBitmap = ImageManager.loadSystem('minimapColor');
};
Window_Base.prototype.refreshMinimap				= function() {
	for(_x = this.getMinimapX() - 1; _x < this.getMinimapWidth() + this.getMinimapX(); _x++){
		for(_y = this.getMinimapY(); _y <this.getMinimapHeight() + this.getMinimapY(); _y++){
				var _caseW = this.getMinimapCaseWidth();
				var _caseX = (_caseW * _x) + this.GFS_x - (_caseW * this.getMinimapX()) + this.getMinimapPadding();
				var _caseY = (_caseW * _y) + this.GFS_y - (_caseW * this.getMinimapY()) + this.hudContentPaddingY();
				
				if(this.GFS_getRegionColors($gameMap.regionId(_x, _y)))
					this.contents.fillRect(_caseX, _caseY, _caseW, _caseW, this.GFS_getRegionColors($gameMap.regionId(_x, _y)));
				
				if(this.minimapIsPlayerPos(_x, _y))
					if(this.minimapZoom < 7)
						this.minimapDrawPoint(0, _caseX, _caseY);
					else
						this.minimapDrawEvent(0, _caseX, _caseY);
		}
	}
};
Window_Base.prototype.refreshMinimapEventsList 		= function() {
	for(i=1; i<$gameMap._events.length;i++){
		if($gameMap._events[i]){
			var _event = $gameMap._events[i];
			if(_event.GFS_type != 0 && this.isInMinimap(_event._x, _event._y)){
				var _caseX = (_event._x - this.getMinimapX()) * this.getMinimapCaseWidth() + this.getMinimapPadding();
				var _caseY = (_event._y - this.getMinimapY()) * this.getMinimapCaseWidth() + this.hudContentPaddingY();
				if(this.minimapZoom > 7)
					this.minimapDrawEvent($gameMap._events[i].GFS_type, _caseX, _caseY);
				else
					this.minimapDrawPoint($gameMap._events[i].GFS_type, _caseX, _caseY);
			}
		}
		
	}
};
//-> Minimap draw
Window_Base.prototype.minimapDrawEvent				= function(id, x , y) {
	var width = 8;
	var height = 8;
	var nbrByLine = 6;
	var bitmap = ImageManager.GFS_loadHud('minimapIcon');
	var pw = width;
	var ph = height;
	var sx = id % nbrByLine * pw;
	var sy = Math.floor(id / nbrByLine) * ph;
	this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};
Window_Base.prototype.minimapDrawPoint				= function(id, x, y) {
	var _caseW = Math.floor(this.getMinimapCaseWidth()/2);
	this.contents.drawCircle(x + _caseW, y  + _caseW, _caseW, this.GFS_getRegionColors(id + 20));
};


//GS HUD
function GFS_Hud(){
    this.initialize.apply(this, arguments);
};
GFS_Hud.prototype									= Object.create(Window_Base.prototype);
GFS_Hud.prototype.initialize						= function() {
	this.GFS_x = this.getOutHudPosX();
	this.GFS_y = this.getOutHudPosY();
	this.GFS_xDest = this.getInHudPosX();
	this.GFS_yDest = this.getInHudPosY();
	this.GFS_content = 0;
	this.GFS_totalWidth = 250;
    Window_Base.prototype.initialize.call(this, this.getInHudPosX(), this.getInHudPosY(), 300, 250);
	this._padding = 0;
	this.GFS_refreshCounter = 0;
	this.refresh();
	this.GFS_cursor = 0;
	this.minimapZoom = 7;
	this.loadHudColorBitmap();
};
// -> getter
GFS_Hud.prototype.getOutHudPosX 					= function() {
	return -100;
};
GFS_Hud.prototype.getOutHudPosY 					= function() {
	return -100;
};
GFS_Hud.prototype.getInHudPosX 						= function() {
	return $gameSystem.GFS_getHudX();
};
GFS_Hud.prototype.getInHudPosY 						= function() {
	return $gameSystem.GFS_getHudY();
};

// -> Refresh
GFS_Hud.prototype.GFS_counterAntiLag				= function() {
	if(this.GFS_refreshCounter < 4){
		this.GFS_refreshCounter++;
		return false;
	};
	this.GFS_refreshCounter = 0;
	return true;
};
GFS_Hud.prototype.refresh							= function() {
	if($gameSystem.GFS_HudNeedRefresh() && this.GFS_counterAntiLag()){
		this.contents.clear();
		if($gameSystem.GFS_hudVisible() > 0)
			this.visible = true;
		else
			this.visible = false;
		this.contents.fontSize = 12;
		this.contents.opacity = 150;
		this.padding = 0;
		this.refreshHud();
	};
};
GFS_Hud.prototype.refreshHud						= function() {
	this.refreshHudChange();
	this.refreshPosition();
	this.refreshHudType();
};
GFS_Hud.prototype.refreshHudChange					= function() {
	if(this.GFS_content != $gameSystem.GFS_getHudForcedContent()){
		if(this.isHudOut()){
			_aliasGFS.log("HUD IS OUT");
			this.GFS_content = $gameSystem.GFS_getHudForcedContent();
			this.visible = true;
			this.GFS_cursor = 0;
			this.setMoveInHud();
			$gameSystem.GFS_setHudVisible($gameSystem.GFS_getHudForcedContent(), true);
		}else if(this.isHudIn()){
			_aliasGFS.log("HUD IS IN");
			this.setMoveOutHud();
		}else{
			_aliasGFS.log("HUD IS WHAT ???");
		}
	}
};
GFS_Hud.prototype.isHudOut							= function() {
	return this.GFS_x == this.getOutHudPosX() && this.GFS_y == this.getOutHudPosY();
};
GFS_Hud.prototype.isHudIn							= function() {
	return this.GFS_x == this.getInHudPosX() && this.GFS_y == this.getInHudPosY();
};
// -> Position
GFS_Hud.prototype.refreshPosition					= function() {
	var _spd = this.getHudMoveSpeed();

	if(this.GFS_x < this.GFS_xDest){
		this.GFS_x = Math.min(_spd + this.GFS_x, this.GFS_xDest);
		_aliasGFS.log("HudMoveRight");
	}
	
	if(this.GFS_y < this.GFS_yDest){
		this.GFS_y = Math.min(_spd + this.GFS_y, this.GFS_yDest);
		_aliasGFS.log("HudMoveUp");
	}
	
	if(this.GFS_x > this.GFS_xDest){
		this.GFS_x = Math.max(this.GFS_x - _spd, this.GFS_xDest);
		_aliasGFS.log("HudMoveLeft");
	}
	
	if(this.GFS_y > this.GFS_yDest){
		this.GFS_y = Math.max(this.GFS_y - _spd, this.GFS_yDest);
		_aliasGFS.log("HudMoveDown ... Get Down on it !");
	}
};
GFS_Hud.prototype.getHudMoveSpeed					= function() {
	return 50;
};
GFS_Hud.prototype.setMoveOutHud						= function() {
	this.GFS_xDest = this.getOutHudPosX();
	this.GFS_yDest = this.getOutHudPosY();
	_aliasGFS.log("MoveHudOut");
};
GFS_Hud.prototype.setMoveInHud						= function() {
	this.GFS_xDest = this.getInHudPosX();
	this.GFS_yDest = this.getInHudPosY();
	_aliasGFS.log("MoveHudIn");
};
GFS_Hud.prototype.refreshHudType					= function() {
	if(this.GFS_content > 0){
		this.GFS_drawLayer();
		this.refreshHpFil();
	}
	switch(this.GFS_content){
		case 0:
			break;
		case 1:
			this.refreshHudStats();
			break;
		case 2:
			this.refreshHudWeapons();
			break;
		case 3:
			this.refreshHudPackage();
			break;
		case 4:
			this.refreshHudMinimap();
			break;
		default:
			_aliasGFS.error("GFS_hud>refreshHudType>line:1318");
			break;
	}
};
// -> MiniMap Hud
GFS_Hud.prototype.refreshHudMinimap					= function() {
	this.refreshMinimap();
	this.refreshMinimapEventsList();
	
};
// -> Package Hud
GFS_Hud.prototype.refreshHudPackage					= function() {
	this.refreshHpFil();
	this.refreshItemsGrid();
};
GFS_Hud.prototype.refreshItemsGrid					= function() {
	var _numCase = $gameParty.GFS_getSlotCapacity();
	var _caseWidth = 4;
	var _itemsList = $gameParty.items();
	var _lines = this.GFS_drawItemsGrid(this.GFS_x, this.GFS_y + 24, _numCase, _caseWidth, _itemsList);
	this.drawText(
		"Weight: " +
		$gameParty.GFS_getWeightUsed() + "/" + $gameParty.GFS_getWeightCapacity() +
		"   -   Slots:" +
		$gameParty.GFS_getSlotUsed() + "/" + _numCase,
		this.GFS_x,
		this.GFS_y + _lines * 32 + 60,
		_caseWidth * 32,
		20,
		'center');
};
// -> Stats Hud
GFS_Hud.prototype.refreshHudStats					= function() {
	this.refreshHpFil(88);
	this.refreshStatsTab();
};
GFS_Hud.prototype.refreshHpFil						= function() {
	this.GFS_drawLife();
};
GFS_Hud.prototype.refreshStatsTab					= function() {
	this.GFS_drawStatsTab(this.GFS_x,this.GFS_y);
};
// -> Weapons Hud
GFS_Hud.prototype.refreshHudWeapons					= function() {
	this.refreshWeapons();
	this.refreshWeapons2();
	this.refreshHpFil(64);
	if(this.refreshCounter >= 10){
		this.refreshCounter = 0;
	}else{
		this.refreshCounter++;
	};
};
GFS_Hud.prototype.refreshWeapons					= function() {
	var _arme = $gamePlayer.GFS_getPlayerArme().id;
	this.GFS_drawWeapon(_arme, 4 + this.GFS_x, 10 + this.GFS_y);
	if(_arme > 5){
		this.GFS_drawMunits(_arme, 4 + this.GFS_x, 48 + this.GFS_y);
		this.GFS_drawPack(_arme, 4 +  + this.GFS_x, 84 +  + this.GFS_y);
	};
};
GFS_Hud.prototype.refreshWeapons2					= function() {
	var _armeA;
	var _armeB;
	if ($gameParty.leader().equips()[1])
		_armeA = $gameParty.leader().equips()[1].id;
	else
		_armeA = 1;
	if ($gameParty.leader().equips()[2])
		_armeB = $gameParty.leader().equips()[2].id;
	else
		_armeB = 1;
	this.contents.textColor = this.textColor(0);
	//this.GFS_drawWeapon2(_armeA, 4, 120);
	this.drawIcon($gameParty.leader().equips()[1].id, 4 + this.GFS_x, 120 + this.GFS_y);
	this.drawText("J", 16 + this.GFS_x, 125 + this.GFS_y, 34, 20, 'center');
	//this.GFS_drawWeapon2(_armeB, 34, 120);
	this.drawIcon($gameParty.leader().equips()[2].id, 34 + this.GFS_x, 120 + this.GFS_y);
	this.drawText("K", 46 + this.GFS_x, 125 + this.GFS_y, 34, 20, 'center');
};

//GS HUD
function GFS_UpperHud(){
    this.initialize.apply(this, arguments);
};
GFS_UpperHud.prototype									= Object.create(Window_Base.prototype);
GFS_Hud.prototype.initialize							= function() {
    Window_Base.prototype.initialize.call(this, 8, 8, 300, 250);
};
GFS_Hud.prototype.refresh							= function() {
	if($gameSystem.GFS_HudNeedRefresh()){
		this.contents.clear();
		if($gameSystem.GFS_hudVisible() > 0)
			this.visible = true;
		else
			this.visible = false;
		this.refreshHud();
	};
};
GFS_Hud.prototype.refreshHud						= function() {
	this.refreshHudMask();
};