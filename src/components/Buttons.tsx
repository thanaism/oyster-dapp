/* eslint-disable react/jsx-props-no-spreading */
import { Button, ButtonProps } from '@chakra-ui/react';
import { FC } from 'react';

export const RoundedButton: FC<ButtonProps> = (props: ButtonProps) => (
  <Button rounded="full" {...props} />
);

export const RedButton: FC<ButtonProps> = (props: ButtonProps) => (
  <RoundedButton bg="red.400" color="white" _hover={{ bg: 'red.500' }} {...props} />
);

export const BlueButton: FC<ButtonProps> = (props: ButtonProps) => (
  <RoundedButton bg="blue.400" color="white" _hover={{ bg: 'blue.500' }} {...props} />
);

export const LightBlueButton: FC<ButtonProps> = (props: ButtonProps) => (
  <RoundedButton bg="blue.200" color="white" _hover={{ bg: 'blue.300' }} {...props} />
);
