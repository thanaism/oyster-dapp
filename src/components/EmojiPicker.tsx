import { FC } from 'react';
import Picker, { IEmojiPickerProps } from 'emoji-picker-react';
import {
  Button,
  Icon,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { BsEmojiSunglasses } from 'react-icons/bs';

const EmojiPickerPopover: FC<IEmojiPickerProps> = (props) => (
  <Popover>
    <PopoverTrigger>
      <Button rounded="full">
        <Icon as={BsEmojiSunglasses} />
      </Button>
    </PopoverTrigger>
    <PopoverContent maxWidth={0} borderStyle="none">
      <PopoverCloseButton />
      <Picker {...props} />
    </PopoverContent>
  </Popover>
);

export default EmojiPickerPopover;
