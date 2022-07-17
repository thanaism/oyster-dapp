import { FC } from 'react';
import Picker, { IEmojiPickerProps } from 'emoji-picker-react';
import {
  Icon,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { BsEmojiSunglasses } from 'react-icons/bs';
import { RoundedButton } from './Buttons';

const EmojiPickerPopover: FC<IEmojiPickerProps> = (props) => (
  <Popover>
    <PopoverTrigger>
      <RoundedButton>
        <Icon as={BsEmojiSunglasses} />
      </RoundedButton>
    </PopoverTrigger>
    <PopoverContent maxWidth={0} borderStyle="none">
      <PopoverCloseButton />
      <Picker {...props} />
    </PopoverContent>
  </Popover>
);

export default EmojiPickerPopover;
