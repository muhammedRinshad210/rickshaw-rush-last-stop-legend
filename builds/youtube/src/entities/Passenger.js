/**
 * RICKSHAW RUSH: LAST STOP LEGEND
 * Passenger Pickup Stops and Destination Drop-off Bays
 */

import { CONFIG } from '../core/Config.js';
import { SoundFX } from '../core/AudioSystem.js';

export class PassengerStop extends Phaser.GameObjects.Container {
  constructor(scene, x, y, destination, passengerType = 'student', lane = 0) {
    super(scene, x, y);
    this.scene = scene;
    this.destination = destination;
    this.passengerType = passengerType;
    this.lane = lane;
    this.isPickedUp = false;

    // Roadside Shelter / Bench Marker
    this.groundMarker = scene.add.graphics();
    this.groundMarker.fillStyle(0xFFEB3B, 0.4);
    this.groundMarker.fillRoundedRect(-34, -20, 68, 80, 8);
    this.groundMarker.lineStyle(2, 0xFFC107, 0.9);
    this.groundMarker.strokeRoundedRect(-34, -20, 68, 80, 8);
    this.add(this.groundMarker);

    // Passenger Character Sprite
    this.sprite = scene.add.image(0, 20, `passenger_${passengerType}`);
    this.add(this.sprite);

    // Destination Preview Bubble above passenger
    this.destBubble = scene.add.image(0, -32, destination.iconKey);
    this.destBubble.setScale(0.65);
    this.add(this.destBubble);

    // Bouncing Destination Arrow / Indicator
    scene.tweens.add({
      targets: this.destBubble,
      y: -40,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Physics Body
    scene.physics.world.enable(this);
    this.body.setSize(70, 70);
    this.body.setOffset(-35, -20);

    scene.add.existing(this);
  }

  collect() {
    if (this.isPickedUp) return null;
    this.isPickedUp = true;
    SoundFX.playPassengerPickup();

    // Boarding animation into auto
    this.scene.tweens.add({
      targets: [this.sprite, this.destBubble],
      scaleX: 0.1,
      scaleY: 0.1,
      alpha: 0,
      duration: 180,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.destroy();
      }
    });

    return {
      destination: this.destination,
      type: this.passengerType,
    };
  }

  update(roadSpeed, deltaSeconds) {
    this.y += roadSpeed * deltaSeconds;
  }
}

export class DropoffZone extends Phaser.GameObjects.Container {
  constructor(scene, x, y, destination, lane = 1) {
    super(scene, x, y);
    this.scene = scene;
    this.destination = destination;
    this.lane = lane;
    this.isDelivered = false;

    // Glowing Checkered Drop-off Bay Banner
    this.baySprite = scene.add.image(0, 0, 'dropoff_bay');
    this.add(this.baySprite);

    // Destination Billboard
    this.destIcon = scene.add.image(0, -48, destination.iconKey);
    this.destIcon.setScale(0.8);
    this.add(this.destIcon);

    // Pulsing glow
    scene.tweens.add({
      targets: this.destIcon,
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Destination Name Badge
    this.nameText = scene.add.text(0, 44, destination.name.toUpperCase(), {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#FFFFFF',
      backgroundColor: '#1B5E20',
      padding: { x: 8, y: 3 }
    }).setOrigin(0.5);
    this.add(this.nameText);

    // Physics Trigger Area
    scene.physics.world.enable(this);
    this.body.setSize(150, 70);
    this.body.setOffset(-75, -35);

    scene.add.existing(this);
  }

  deliver() {
    if (this.isDelivered) return 0;
    this.isDelivered = true;
    SoundFX.playPassengerDelivery();

    // Delivery confetti flash & disembark
    this.scene.spawnConfetti(this.x, this.y);

    this.scene.tweens.add({
      targets: this,
      scaleX: 1.25,
      scaleY: 1.25,
      alpha: 0,
      duration: 300,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.destroy();
      }
    });

    return this.destination.fareBonus;
  }

  update(roadSpeed, deltaSeconds) {
    this.y += roadSpeed * deltaSeconds;
  }
}

