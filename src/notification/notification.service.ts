import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Pusher from 'pusher';
import { randomUUID } from 'crypto';
import {
  AdminNotificationPayload,
  CreateAdminNotificationPayload,
} from './notification.types';

export const ADMIN_NOTIFICATION_CHANNEL = 'private-admin-notifications';
export const ADMIN_NOTIFICATION_EVENT = 'admin-notification';

@Injectable()
export class NotificationService {
  private readonly pusher: Pusher | null = null;
  private readonly enabled: boolean;

  constructor(private readonly configService: ConfigService) {
    const appId = this.configService.get<string>('PUSHER_APP_ID');
    const key = this.configService.get<string>('PUSHER_KEY');
    const secret = this.configService.get<string>('PUSHER_SECRET');
    const cluster = this.configService.get<string>('PUSHER_CLUSTER');

    this.enabled = Boolean(appId && key && secret && cluster);

    if (!this.enabled) {
      console.warn(
        'Pusher notification is disabled. Missing PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, or PUSHER_CLUSTER.',
      );
      return;
    }

    this.pusher = new Pusher({
      appId: appId as string,
      key: key as string,
      secret: secret as string,
      cluster: cluster as string,
      useTLS: true,
    });
  }

  authorizePrivateChannel(socketId: string, channelName: string) {
    if (!socketId || !channelName) {
      throw new BadRequestException('socket_id and channel_name are required');
    }

    if (channelName !== ADMIN_NOTIFICATION_CHANNEL) {
      throw new ForbiddenException('You are not allowed to access this channel');
    }

    if (!this.pusher) {
      throw new InternalServerErrorException('Pusher is not configured');
    }

    return this.pusher.authorizeChannel(socketId, channelName);
  }

  async sendAdminNotification(payload: CreateAdminNotificationPayload) {
    if (!this.pusher) {
      return;
    }

    const notification: AdminNotificationPayload = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...payload,
    };

    try {
      await this.pusher.trigger(
        ADMIN_NOTIFICATION_CHANNEL,
        ADMIN_NOTIFICATION_EVENT,
        notification,
      );
    } catch (error) {
      console.error('Pusher notification failed:', error);
    }
  }
}